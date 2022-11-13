import AWS from "aws-sdk";

export const tableName = process.env.DYNAMODB_TABLE ?
  process.env.DYNAMODB_TABLE : "solutions-dev";

let db;
let client;

// connect to local DB if running offline
function getOptions() {  
  return process.env.IS_OFFLINE ? {
    region: "localhost",
    endpoint: "http://localhost:8000",
  } : {};
}

export function getDb() {
  if (db) {
    return db;
  }

  const options = getOptions();
  db = new AWS.DynamoDB(options);

  return db;
}

export function getDocumentClient() {
  if (client) {
    return client;
  }

  const options = getOptions();
  client = new AWS.DynamoDB.DocumentClient(options);

  return client;
}
