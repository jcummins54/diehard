import { responseHeaders } from "./config.js";
import { getDocumentClient } from "./dynamodb.js";
import { validator } from "./validators/validator.js";
import { solve } from "./solve.js";

export function get(event, context, callback) {
  const docClient = getDocumentClient();

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  const errors = validator(event.pathParameters);
  if (errors.length > 0) {
    callback(null, {
      statusCode: 400,
      headers: responseHeaders,
      body: JSON.stringify(errors),
    });

    return;
  }

  // fetch solution from the database
  docClient.get(params, (error, result) => {
    // handle potential errors
    if (error) {
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Couldn't fetch the solution item." }),
      });

      return;
    }

    if (result.Item === undefined) {
      solve(event.pathParameters.id, callback);

      return;
    }

    const response = {
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(result.Item),
    };

    callback(null, response);
  });
}
