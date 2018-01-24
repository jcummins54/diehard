const AWS = require("aws-sdk");
const config = require("./config");

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamodb = new AWS.DynamoDB(options);

const seed = require("../offline/migrations/solutions.json");

module.exports.delete = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  function createTable(seed) {
    dynamodb.createTable(seed.Table, error => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: config.responseHeaders,
          body: JSON.stringify({ error: `Couldn't create table ${seed.Table.TableName}.` }),
        });
        return;
      }

      // create a response
      const response = {
        statusCode: 200,
        headers: config.responseHeaders,
        body: JSON.stringify({ result: `table ${seed.Table.TableName} created` }),
      };
      callback(null, response);
    });
  }

  // delete the solution from the database
  dynamodb.deleteTable(params, (error, data) => {
    // handle potential errors
    if (error) {
      console.error(error);
      if (error.code === "ResourceNotFoundException") {
        createTable(seed);
        return;
      }
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: config.responseHeaders,
        body: JSON.stringify({ error: `Couldn't delete table ${params.TableName}.` }),
      });
      return;
    } else if (data) {
      createTable(seed);
    }
  });
};
