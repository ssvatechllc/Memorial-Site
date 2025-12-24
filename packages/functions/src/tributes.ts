import { Table } from "sst/node/table";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

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
      ":type": "tribute"
    }
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items || []),
  };
}

export async function create(event: any) {
  const data = JSON.parse(event.body);
  const tribute = {
    id: uuidv4(),
    type: "tribute",
    status: "pending",
    name: data.name,
    relationship: data.relationship,
    message: data.message,
    email: data.email,
    date: new Date().toISOString(),
  };

  await docClient.send(new PutCommand({
    TableName: Table.ContentTable.tableName,
    Item: tribute,
  }));

  return {
    statusCode: 201,
    body: JSON.stringify({ success: true }),
  };
}
