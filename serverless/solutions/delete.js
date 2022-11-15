import { responseHeaders } from "./config.js";
import { getDb, tableName } from "./dynamodb.js";
import tableSchema from "../offline/migrations/solutions.json" assert { type: "json" };

function createTable(db, callback) {  
  const params = tableSchema.Table;
  params.TableName = tableName;

  db.createTable(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: responseHeaders,
        body: JSON.stringify({ error: `Couldn't create table ${params.TableName}.` }),
      });
      return;
    }

    if (data) {
      console.log(data);
    }

    // create a response
    const response = {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify({ result: `table ${params.TableName} created` }),
    };

    callback(null, response);
  });
}

export function resetSolutionsTable(event, context, callback) {
  const db = getDb();
  const params = {
    TableName: tableName,
  };

  // delete the solution from the database
  db.deleteTable(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      if (error.code === "ResourceNotFoundException") {
        createTable(db);
        return;
      }
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: responseHeaders,
        body: JSON.stringify({ error: `Couldn't delete table ${params.TableName}.` }),
      });
      return;
    } else if (data) {
      console.log(data);
      createTable(db, callback);
    }
  });
}
