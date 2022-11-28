import { responseHeaders } from "./config.js";
import { getSolutionRecord, createSolutionRecord } from "./dynamodb.js";
import { validator } from "./validators/validator.js";
import { findSolutions } from "./diehard.js";

export async function getOrCreateSolution(id) {
  try {
    // fetch solution from the database
    const result = await getSolutionRecord(id);
    
    if (result && result.Item) {
      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(result.Item),
      };
    }

    // If solution not found in db, create and store the solution
    const data = findSolutions(id);

    try {
      await createSolutionRecord(data);

      return {
        statusCode: 200,
        headers: responseHeaders,
        body: JSON.stringify(data),
      };
    } catch (error) {
      console.error(error);

      return {
        statusCode: error.statusCode || 501,
        headers: responseHeaders,
        body: JSON.stringify({ error: "Couldn't create the solution item." }),
      };
    }
  } catch (error) {
    console.error(error);

    return {
      statusCode: error.statusCode || 501,
      headers: responseHeaders,
      body: JSON.stringify({ error: "Couldn't fetch the solution item." }),
    };
  }
}

// eslint-disable-next-line no-unused-vars
export async function get(event, context) {
  const errors = validator(event.pathParameters);
  if (errors.length > 0) {
    return {
      statusCode: 400,
      headers: responseHeaders,
      body: JSON.stringify(errors),
    };
  }

  return getOrCreateSolution(event.pathParameters.id);
}
