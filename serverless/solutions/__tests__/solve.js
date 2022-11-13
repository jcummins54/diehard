import { solve } from "../solve";
import { findSolutions } from "../diehard";
import { getDocumentClient } from "../dynamodb";

process.env.IS_OFFLINE = true;
process.env.DYNAMODB_TABLE = "solutions-dev";

jest.mock("../diehard");
jest.mock("../dynamodb");

describe("solve", () => {
  it("should save to the db", () => {
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
    
    const docClientPut = jest.fn();
    getDocumentClient.mockReturnValue({put: docClientPut});

    const params = {
      TableName: "solutions-dev",
      Item: data,
    };

    solve("3-5-4", jest.fn());

    expect(docClientPut).toHaveBeenCalledWith(params, expect.any(Function));
  });
});
