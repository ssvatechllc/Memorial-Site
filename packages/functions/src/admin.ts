import { Table } from "sst/node/table";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const validateAdmin = (event: any) => {
  const adminKey = event.headers["x-admin-key"];
  return adminKey === process.env.ADMIN_KEY;
};

export async function listPending(event: any) {
  if (!validateAdmin(event)) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const result = await docClient.send(new QueryCommand({
    TableName: Table.ContentTable.tableName,
    IndexName: "StatusIndex",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "pending" }
  }));

  const items = result.Items || [];
  return {
    statusCode: 200,
    body: JSON.stringify({
      tributes: items.filter(i => i.type === "tribute"),
      gallery: items.filter(i => i.type === "gallery"),
    }),
  };
}

export async function updateStatus(event: any) {
  if (!validateAdmin(event)) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  const { type, id, status } = JSON.parse(event.body);

  if (status === "approved") {
    await docClient.send(new UpdateCommand({
      TableName: Table.ContentTable.tableName,
      Key: { id },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: { ":status": "approved" }
    }));
  } else if (status === "deleted") {
    await docClient.send(new DeleteCommand({
      TableName: Table.ContentTable.tableName,
      Key: { id }
    }));
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
}
