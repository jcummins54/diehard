import { get } from "../get";
import { responseHeaders } from "../config";
import { findSolutions } from "../diehard";
import { getSolutionRecord, createSolutionRecord } from "../dynamodb";

process.env.IS_OFFLINE = true;
process.env.DYNAMODB_TABLE = "solutions-dev";

jest.mock("../diehard");
jest.mock("../dynamodb");

describe("get", () => {
  it("should return errors on invalid input", async () => {
    const result1 = await get({ pathParameters: {} });
    expect(result1).toMatchObject({
      statusCode: 400,
      headers: responseHeaders,
      body: "[{\"instancePath\":\"\",\"schemaPath\":\"#/errorMessage\",\"keyword\":\"errorMessage\",\"params\":{\"errors\":[{\"instancePath\":\"\",\"schemaPath\":\"#/required\",\"keyword\":\"required\",\"params\":{\"missingProperty\":\"id\"},\"message\":\"must have required property 'id'\",\"emUsed\":true}]},\"message\":\"Path should be in the form 'decimal-decimal-decimal' e.g. '/solutions/3-5-4'.\"}]",
    });

    const result2 = await get({ pathParameters: { id: "3-5-6" } });
    expect(result2).toMatchObject({
      statusCode: 400,
      headers: responseHeaders,
      body: "[{\"message\":\"Goal amount must be greater than 0 and less than the largest jug.\"}]",
    });

    const result3 = await get({ pathParameters: { id: "a-b-c" } });
    expect(result3).toMatchObject({
      statusCode: 400,
      headers: responseHeaders,
      body: "[{\"instancePath\":\"\",\"schemaPath\":\"#/errorMessage\",\"keyword\":\"errorMessage\",\"params\":{\"errors\":[{\"instancePath\":\"/id\",\"schemaPath\":\"#/properties/id/pattern\",\"keyword\":\"pattern\",\"params\":{\"pattern\":\"^([0-9]+(.[0-9]{1,2})?)-([0-9]+(.[0-9]{1,2})?)-([0-9]+(.[0-9]{1,2})?)$\"},\"message\":\"must match pattern \\\"^([0-9]+(.[0-9]{1,2})?)-([0-9]+(.[0-9]{1,2})?)-([0-9]+(.[0-9]{1,2})?)$\\\"\",\"emUsed\":true}]},\"message\":\"Path should be in the form 'decimal-decimal-decimal' e.g. '/solutions/3-5-4'.\"}]",
    });
  });

  it("should check the db for solution and save to the db when not found", async () => {
    const data = {
      "id": "3-5-4",
      "winner": "2",
      "results": [
        {
          "count": 9,
          "result": true,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
        },
        {
          "count": 7,
          "result": true,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}",
        },
      ],
      "createdAt": 1517104935042,
      "isMultipleOfGCD": true,
      "stepList": [[], []],
    };
    findSolutions.mockImplementation(() => data);
    getSolutionRecord.mockImplementation(() => { });
    createSolutionRecord.mockImplementation(() => { });
    
    const result = await get({ pathParameters: { id: data.id } });

    expect(getSolutionRecord).toHaveBeenCalledWith(data.id);
    expect(createSolutionRecord).toHaveBeenCalledWith(data);
    expect(result).toMatchObject({
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(data),
    });
  });  
});
