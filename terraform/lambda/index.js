const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, PutCommand, UpdateCommand, DeleteCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);
const s3Client = new S3Client({});

const TABLE_NAME = process.env.TABLE_NAME;
const BUCKET_NAME = process.env.BUCKET_NAME;
const ADMIN_KEY = process.env.ADMIN_KEY;

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
        src: `/${i.key}`
      }));
      return response(200, items);
    }

    // 4. Gallery Create (Metadata only, after S3 upload)
    if (path === "/gallery" && method === "POST") {
      const data = JSON.parse(event.body);
      const isVideo = data.key?.toLowerCase().endsWith('.mp4') || data.key?.toLowerCase().endsWith('.mov') || data.key?.toLowerCase().endsWith('.avi');
      const item = {
        id: crypto.randomUUID(),
        type: "gallery",
        status: "pending",
        ...data,
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

    // 6. Admin: List Pending
    // 6. Admin: List Pending
    if (path === "/admin/pending" && method === "GET") {
      if (getHeader("x-admin-key") !== ADMIN_KEY) return response(401, { error: "Unauthorized" });
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
          src: `/${i.key}`
        }))
      });
    }

    // 7. Admin: Update Status (Bulk Support)
    // 7. Admin: Update Status (Bulk Support)
    if (path === "/admin/status" && method === "PATCH") {
      if (getHeader("x-admin-key") !== ADMIN_KEY) return response(401, { error: "Unauthorized" });
      const { id, ids, status } = JSON.parse(event.body);
      const targetIds = ids || (id ? [id] : []);
      
      if (targetIds.length === 0) return response(400, { error: "No IDs provided" });

      for (const targetId of targetIds) {
        if (status === "approved") {
          await docClient.send(new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { id: targetId },
            UpdateExpression: "SET #status = :status",
            ExpressionAttributeNames: { "#status": "status" },
            ExpressionAttributeValues: { ":status": "approved" }
          }));
        } else {
          await docClient.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { id: targetId } }));
        }
      }
      return response(200, { success: true, count: targetIds.length });
    }

    // 8. Admin: List Approved (Managament)
    if (path === "/admin/approved" && method === "GET") {
      if (getHeader("x-admin-key") !== ADMIN_KEY) return response(401, { error: "Unauthorized" });
      
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
          src: `/${i.key}`
        })).sort((a, b) => (a.order || 0) - (b.order || 0)) // Sort by order
      });
    }

    // 9. Admin: Delete Approved Item
    if (path === "/admin/content" && method === "DELETE") {
      if (getHeader("x-admin-key") !== ADMIN_KEY) return response(401, { error: "Unauthorized" });
      
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
      if (getHeader("x-admin-key") !== ADMIN_KEY) return response(401, { error: "Unauthorized" });
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

    // 11. Admin: Seed Legacy Data
    // 11. Admin: Seed Legacy Data
    if (path === "/admin/seed" && method === "POST") {
      if (getHeader("x-admin-key") !== ADMIN_KEY) return response(401, { error: "Unauthorized" });
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
