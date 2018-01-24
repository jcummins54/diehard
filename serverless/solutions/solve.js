const config = require("./config");
const dynamodb = require("./dynamodb");
const diehard = require("./diehard");

module.exports.create = (id, callback) => {
  const timestamp = new Date().getTime();

  let data = diehard.findSolutions(id);
  data.id = id;
  data.createdAt = timestamp;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: data,
  };

  dynamodb.put(params, error => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: config.responseHeaders,
        body: JSON.stringify({ error: "Couldn't create the solution item." }),
      });
      return;
    }

    const response = {
      statusCode: 200,
      headers: config.responseHeaders,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
