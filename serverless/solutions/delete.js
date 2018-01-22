const AWS = require("aws-sdk");

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
    console.log("createTable with seed:", seed);
    dynamodb.createTable(seed.Table, error => {
      // handle potential errors
      if (error) {
        console.error(error);
        callback(null, {
          statusCode: error.statusCode || 501,
          headers: { "Content-Type": "text/plain" },
          body: `Couldn't create table ${seed.table.TableName}.`,
        });
        return;
      }

      // create a response
      const response = {
        statusCode: 200,
        body: JSON.stringify({ result: `table ${seed.table.TableName} created` }),
      };
      callback(null, response);
    });
  }

  // delete the solution from the database
  dynamodb.deleteTable(params, error => {
    // handle potential errors
    if (error) {
      console.error(error);
      if (error.code === "ResourceNotFoundException") {
        createTable(seed);
        return;
      }
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: `Couldn't delete table ${params.TableName}.`,
      });
      return;
    }

    createTable(seed);
  });
};
