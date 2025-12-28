const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, QueryCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { google } = require("googleapis");
const stream = require("stream");

const s3Client = new S3Client({});
const dbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dbClient);

const TABLE_NAME = process.env.TABLE_NAME;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
const youtube = google.youtube({ version: "v3", auth: oauth2Client });

exports.handler = async (event) => {
  console.log("Event:", JSON.stringify(event));
  
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    console.warn("YouTube credentials missing. Skipping video processing.");
    return;
  }

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    
    // Only process videos in media/ folder
    if (!key.startsWith("media/") || !isVideo(key)) {
      console.log("Skipping non-video file:", key);
      continue;
    }

    try {
      // 1. Get metadata from DynamoDB (to find the item associated with this key)
      // Note: We might need a GSI or a scan if we don't have the ID. 
      // Better: Store the ID in S3 metadata during upload.
      
      console.log(`Processing video: ${key} from bucket: ${bucket}`);

      // 2. Download from S3 and stream to YouTube
      const s3Response = await s3Client.send(new GetObjectCommand({
        Bucket: bucket,
        Key: key
      }));

      const youtubeResponse = await youtube.videos.insert({
        part: "snippet,status",
        requestBody: {
          snippet: {
            title: `Memorial Tribute - ${new Date().toLocaleDateString()}`,
            description: "User submitted tribute video for Nanna Memorial Site",
            categoryId: "22" // People & Blogs
          },
          status: {
            privacyStatus: "unlisted",
            selfDeclaredMadeForKids: false
          }
        },
        media: {
          body: s3Response.Body
        }
      });

      const youtubeId = youtubeResponse.data.id;
      console.log(`Successfully uploaded to YouTube. ID: ${youtubeId}`);

      // 3. Update DynamoDB with youtubeId
      const searchResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: "KeyIndex",
        KeyConditionExpression: "#key = :key",
        ExpressionAttributeNames: { "#key": "key" },
        ExpressionAttributeValues: { ":key": key }
      }));

      if (searchResult.Items && searchResult.Items.length > 0) {
        const item = searchResult.Items[0];
        await docClient.send(new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id: item.id },
          UpdateExpression: "SET youtubeId = :youtubeId, videoStatus = :status",
          ExpressionAttributeValues: { 
            ":youtubeId": youtubeId,
            ":status": "processed"
          }
        }));
        console.log(`Updated DynamoDB item ${item.id} with YouTube ID.`);
      } else {
        console.warn(`Could not find DynamoDB item for key: ${key}`);
      }
    } catch (error) {
      console.error("Error processing video:", error);
    }
  }
};

function isVideo(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  return ["mp4", "mov", "avi", "mkv", "webm"].includes(ext);
}
