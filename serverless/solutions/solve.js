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
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { "Content-Type": "text/plain" },
        body: "Couldn't create the solution item.",
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
