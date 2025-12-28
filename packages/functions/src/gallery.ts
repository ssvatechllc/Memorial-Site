import { Table } from "sst/node/table";
import { Bucket } from "sst/node/bucket";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client({});

export async function list(event: any) {
  const result = await docClient.send(new QueryCommand({
    TableName: Table.ContentTable.tableName,
    IndexName: "StatusIndex",
    KeyConditionExpression: "#status = :status AND #type = :type",
    ExpressionAttributeNames: {
      "#status": "status",
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":status": "approved",
      ":type": "gallery"
    }
  }));

  // Append S3 URL to items
  const items = (result.Items || []).map(item => ({
    ...item,
    src: item.src || `https://${Bucket.Media.bucketName}.s3.amazonaws.com/${item.key}`
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(items),
  };
}

export async function create(event: any) {
  const data = JSON.parse(event.body);
  const isVideo = data.key?.toLowerCase().endsWith('.mp4') || data.key?.toLowerCase().endsWith('.mov') || data.key?.toLowerCase().endsWith('.avi');
  const isAudio = data.key?.toLowerCase().endsWith('.mp3') || data.key?.toLowerCase().endsWith('.wav') || data.key?.toLowerCase().endsWith('.m4a');
  
  const galleryItem = {
    id: uuidv4(),
    type: "gallery",
    status: "pending",
    title: data.title,
    category: data.category,
    year: data.year,
    key: data.key,
    contentType: isVideo ? "video" : isAudio ? "audio" : "image",
    videoStatus: isVideo ? "processing" : undefined,
    date: new Date().toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: Table.ContentTable.tableName,
    Item: galleryItem,
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({ success: true }),
  };
}

export async function getUploadUrl(event: any) {
  const data = JSON.parse(event.body);
  const key = `${uuidv4()}-${data.fileName}`;

  const command = new PutObjectCommand({
    Bucket: Bucket.Media.bucketName,
    Key: key,
    ContentType: data.fileType,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl: url,
      key: key,
    }),
  };
}
