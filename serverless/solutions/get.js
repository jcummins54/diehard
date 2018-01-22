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
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't fetch the solution item.",
      });
      return;
    }

    const errors = validator.validate(event.pathParameters);
    if (errors.length > 0) {
      console.error(errors);
      callback(null, {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: errors,
      });
      return;
    }

    if (result.Item === undefined) {
      solve.create(event.pathParameters.id, callback);
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
    callback(null, response);
  });
};
