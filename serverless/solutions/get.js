const config = require("./config");
const dynamodb = require("./dynamodb");
const solve = require("./solve");
const validator = require("./validators/validator");

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  // fetch solution from the database
  dynamodb.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: config.responseHeaders,
        body: JSON.stringify({ error: "Couldn't fetch the solution item." }),
      });
      return;
    }

    const errors = validator.validate(event.pathParameters);
    if (errors.length > 0) {
      callback(null, {
        statusCode: 400,
        headers: config.responseHeaders,
        body: JSON.stringify(errors),
      });
      return;
    }

    if (result.Item === undefined) {
      solve.create(event.pathParameters.id, callback);
      return;
    }

    const response = {
      statusCode: 200,
      headers: config.responseHeaders,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
