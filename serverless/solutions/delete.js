import { responseHeaders } from "./config.js";
import { createSolutionsTable, dropSolutionsTable, tableName } from "./dynamodb.js";

// eslint-disable-next-line no-unused-vars
export async function resetSolutionsTable(event, context) {
  try {
    await dropSolutionsTable();    
  } catch (error) {
    // ResourceNotFoundException indicates the table has never been created,
    // so we can move on to creating the table
    if (error.code !== "ResourceNotFoundException") {
      return {
        statusCode: error.statusCode || 501,
        headers: responseHeaders,
        body: JSON.stringify({ error: `Couldn't delete table ${tableName}.` }),
      };
    }
  }

  try {
    await createSolutionsTable();

    return {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ result: `table ${tableName} created` }),
    };
  } catch (error) {
    return {
      statusCode: error.statusCode || 501,
      headers: responseHeaders,
      body: JSON.stringify({ error: `Couldn't create table ${tableName}.` }),
    };
  }
}
