const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand, GetCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);
const s3Client = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;
const ADMIN_KEY = process.env.ADMIN_KEY;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SESSION_SECRET = process.env.SESSION_SECRET || "nanna-memorial-fallback-secret";

// Auth Helpers
const generateToken = (user) => {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(JSON.stringify({ user, exp: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(`${header}.${payload}`).digest("base64url");
  return `${header}.${payload}.${signature}`;
};

const verifyToken = (token) => {
  try {
    const [header, payload, signature] = token.split(".");
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(`${header}.${payload}`).digest("base64url");
    if (signature !== expectedSignature) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return decoded.exp > Date.now() ? decoded : null;
  } catch (e) { return null; }
};

exports.handler = async (event) => {
  const path = event.path;
  const method = event.httpMethod;
  const headers = event.headers;

  // Global CORS handling for OPTIONS pre-flight
  if (method === "OPTIONS") {
    return response(200, { message: "OK" });
  }

  try {
    // Case-insensitive header lookup
    const getHeader = (name) => headers[name] || headers[name.toLowerCase()] || headers[name.toUpperCase()];
    
    const isAuthorized = () => {
      const auth = getHeader("Authorization");
      if (auth && auth.startsWith("Bearer ")) {
        return verifyToken(auth.substring(7)) !== null;
      }
      return getHeader("x-admin-key") === ADMIN_KEY;
    };

    // 0. Admin Login
    if (path === "/admin/login" && method === "POST") {
      const { username, password } = JSON.parse(event.body);
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return response(200, { token: generateToken(username) });
      }
      return response(401, { error: "Invalid credentials" });
    }
    
    // 1. Tributes List
    if (path === "/tributes" && method === "GET") {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusIndex",
        KeyConditionExpression: "#status = :status AND #type = :type",
        ExpressionAttributeNames: { "#status": "status", "#type": "type" },
        ExpressionAttributeValues: { ":status": "approved", ":type": "tribute" }
      }));
      return response(200, result.Items || []);
    }

    // 2. Tribute Create
    if (path === "/tributes" && method === "POST") {
      const data = JSON.parse(event.body);
      const item = {
        id: crypto.randomUUID(),
        type: "tribute",
        status: "pending",
        ...data,
        date: new Date().toISOString()
      };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return response(201, { success: true });
    }

    // 3. Gallery List
    if (path === "/gallery" && method === "GET") {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusIndex",
        KeyConditionExpression: "#status = :status AND #type = :type",
        ExpressionAttributeNames: { "#status": "status", "#type": "type" },
        ExpressionAttributeValues: { ":status": "approved", ":type": "gallery" }
      }));
      const items = (result.Items || []).map(i => ({
        ...i,
        src: i.src || `/${i.key}`
      }));
      return response(200, items);
    }

    // 4. Gallery Create (Metadata only, after S3 upload)
    if (path === "/gallery" && method === "POST") {
      const data = JSON.parse(event.body);
      const isVideo = data.key?.toLowerCase().endsWith('.mp4') || data.key?.toLowerCase().endsWith('.mov') || data.key?.toLowerCase().endsWith('.avi') || data.key?.toLowerCase().endsWith('.webm');
      const isAudio = data.key?.toLowerCase().endsWith('.mp3') || data.key?.toLowerCase().endsWith('.wav') || data.key?.toLowerCase().endsWith('.m4a');
      const item = {
        id: crypto.randomUUID(),
        type: "gallery",
        status: "pending",
        ...data,
        contentType: isVideo ? "video" : isAudio ? "audio" : "image",
        videoStatus: isVideo ? "processing" : undefined,
        date: new Date().toISOString()
      };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return response(201, { success: true });
    }


    // 5. Get Upload URL
    if (path === "/upload-url" && method === "POST") {
      const { fileName, fileType } = JSON.parse(event.body);
      const key = `media/${crypto.randomUUID()}-${fileName}`;
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: fileType
      });
      const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
      return response(200, { uploadUrl: url, key });
    }
    
    // 5.5 Message Submit
    if (path === "/messages" && method === "POST") {
      const data = JSON.parse(event.body);
      const item = {
        id: crypto.randomUUID(),
        type: "message",
        status: "new",
        ...data,
        date: new Date().toISOString()
      };
      await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
      return response(201, { success: true });
    }

    // 6. Admin: List Pending
    // 6. Admin: List Pending
    if (path === "/admin/pending" && method === "GET") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusIndex",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "pending" }
      }));
      const items = result.Items || [];
      return response(200, {
        tributes: items.filter(i => i.type === "tribute"),
        gallery: items.filter(i => i.type === "gallery").map(i => ({
          ...i,
          src: i.src || `/${i.key}`
        }))
      });
    }

    // 7. Admin: Update Status (Bulk Support)
    // 7. Admin: Update Status (Bulk Support)
    if (path === "/admin/status" && method === "PATCH") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      const { id, ids, status } = JSON.parse(event.body);
      const targetIds = ids || (id ? [id] : []);
      
      if (targetIds.length === 0) return response(400, { error: "No IDs provided" });

      for (const targetId of targetIds) {
        if (status === "approved" || status === "read") {
          await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: targetId },
            UpdateExpression: "SET #status = :status",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: { ":status": status }
          }));
        } else {
          await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: targetId } }));
        }
      }
      return response(200, { success: true, count: targetIds.length });
    }

    // 8. Admin: List Approved (Managament)
    if (path === "/admin/approved" && method === "GET") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "StatusIndex",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: { ":status": "approved" }
      }));
      
      const items = result.Items || [];
      return response(200, {
        tributes: items.filter(i => i.type === "tribute"),
        gallery: items.filter(i => i.type === "gallery").map(i => ({
          ...i,
          src: i.src || `/${i.key}`
        })).sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
      });
    }

    // 8.5 Admin: List Messages
    if (path === "/admin/messages" && method === "GET") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      const result = await docClient.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: "#type = :type",
        ExpressionAttributeNames: { "#type": "type" },
        ExpressionAttributeValues: { ":type": "message" }
      }));
      return response(200, result.Items || []);
    }

    // 9. Admin: Delete Approved Item
    if (path === "/admin/content" && method === "DELETE") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      
      let id;
      // Try getting ID from body
      if (event.body) {
        try {
          const body = JSON.parse(event.body);
          if (body.id) id = String(body.id);
        } catch (e) {
          console.log("Error parsing DELETE body", e);
        }
      }
      
      // Fallback/Override from Query String
      if (event.queryStringParameters && event.queryStringParameters.id) {
        id = event.queryStringParameters.id;
      }

      if (!id) return response(400, { error: "Missing ID" });

      // Get item to find S3 key if needed
      const item = await docClient.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: { id }
      }));

      if (item.Item && item.Item.key) {
        try {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: item.Item.key
          }));
        } catch (e) {
          console.error("S3 delete failed", e);
        }
      }

      await docClient.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id }
      }));
      return response(200, { success: true });
    }

    // 10. Admin: Reorder Gallery
    // 10. Admin: Reorder Gallery
    if (path === "/admin/gallery/order" && method === "PATCH") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      const { items } = JSON.parse(event.body); // Expects array of { id, order }

      for (const item of items) {
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id: item.id },
          UpdateExpression: "SET #order = :order",
          ExpressionAttributeNames: { "#order": "order" },
          ExpressionAttributeValues: { ":order": item.order }
        }));
      }
      return response(200, { success: true });
    }

    // 12. Admin: Update Gallery Item (Manual fixes)
    if (path === "/admin/gallery/item" && method === "PATCH") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      const { id, updates } = JSON.parse(event.body);
      
      if (!id || !updates || Object.keys(updates).length === 0) {
        return response(400, { error: "Missing ID or updates" });
      }

      const expressions = [];
      const attributeNames = {};
      const attributeValues = {};

      Object.keys(updates).forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        expressions.push(`${attrName} = ${attrValue}`);
        attributeNames[attrName] = key;
        attributeValues[attrValue] = updates[key];
      });

      await docClient.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: { id },
        UpdateExpression: `SET ${expressions.join(", ")}`,
        ExpressionAttributeNames: attributeNames,
        ExpressionAttributeValues: attributeValues
      }));

      return response(200, { success: true });
    }

    // 11. Admin: Seed Legacy Data
    // 11. Admin: Seed Legacy Data
    if (path === "/admin/seed" && method === "POST") {
      if (!isAuthorized()) return response(401, { error: "Unauthorized" });
      const { items } = JSON.parse(event.body); // Array of legacy items

      let count = 0;
      for (const item of items) {
        // Check if exists by ID or similar key to prevent duplicates if run multiple times?
        // For now, we trust the client generated IDs or just overwrite.
        const dynamoItem = {
           id: item.id.toString(), // Ensure string IDs
           title: item.title,
           description: item.description,
           category: item.category,
           year: item.year,
           src: item.src,
           type: item.type,
           status: "approved", // Legacy items are auto-approved
           date: new Date().toISOString(),
           isLegacy: true // Marker for legacy items
        };
        
        // Remove 'src' if we want to rely on 'key', but legacy items might be local paths
        // For local assets (e.g. /assets/images/...), we store them as is.
        // The src mapping logic in GET /gallery needs to handle both.
        
        await docClient.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: dynamoItem
        }));
        count++;
      }
      return response(200, { success: true, count });
    }

    return response(404, { error: "Not Found" });
  } catch (error) {
    console.error(error);
    return response(500, { error: "Internal Server Error" });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,x-admin-key,Authorization,Origin,Accept,X-Requested-With",
      "Access-Control-Allow-Headers": "Content-Type,x-admin-key,Authorization,Origin,Accept,X-Requested-With",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST,PATCH,DELETE,PUT"
    },
    body: JSON.stringify(body)
  };
}
