import { responseHeaders } from "./config.js";
import { getDocumentClient, tableName } from "./dynamodb.js";
import { findSolutions } from "./diehard.js";

function createSolutionRecord(data, callback) {
  const docClient = getDocumentClient();
  const params = {
    TableName: tableName,
    Item: data,
  };

  docClient.put(params, error => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Couldn't create the solution item." }),
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(params.Item),
    };

    callback(null, response);
  });
}

export function solve(id, callback) {
  const data = findSolutions(id); 

  if (data.error !== undefined) {
    callback(null, {
      statusCode: 400,
      headers: responseHeaders,
      body: JSON.stringify(data),
    });

    return;
  }
  
  data.id = id;
  data.createdAt = new Date().getTime();
  createSolutionRecord(data, callback);
}
