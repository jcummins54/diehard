import AWS from "aws-sdk";
import tableSchema from "../offline/migrations/solutions.json" assert { type: "json" };

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

export async function getSolutionRecord(id) {
  const docClient = getDocumentClient();
  const params = {
    TableName: tableName,
    Key: {
      id,
    },
  };

  return docClient
    .get(params)
    .promise()
    .then(
      (result) => result,
      (error) => Promise.reject(error),
    );
}
export async function createSolutionRecord(data) {
  const docClient = getDocumentClient();
  const params = {
    TableName: tableName,
    Item: data,
  };

  return docClient
    .put(params)
    .promise()
    .then(
      (result) => result,
      (error) => Promise.reject(error),
    );
}

export async function createSolutionsTable() {
  const db = getDb();
  const params = tableSchema.Table;
  params.TableName = tableName;

  return db.createTable(params)
    .promise()
    .then(
      (result) => result,
      (error) => Promise.reject(error),
    );
}

export async function dropSolutionsTable() {
  const db = getDb();
  const params = {
    TableName: tableName,
  };

  return db.deleteTable(params)
    .promise()
    .then(
      (result) => result,
      (error) => Promise.reject(error),
    );
}
