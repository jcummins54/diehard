jest.unmock("../solve");

process.env.IS_OFFLINE = true;
process.env.DYNAMODB_TABLE = "solutions-dev";

let solve;
let diehard;

beforeEach(() => {
  jest.resetModules();
  solve = require("../solve");
  diehard = require("../diehard");
});

describe("create", () => {
  it("should save to the db", () => {
    const data = {
      "id": "3-5-4",
      "winner": "2",
      "results": [
        {
          "count": 9,
          "result": true,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}"
        },
        {
          "count": 7,
          "result": true,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}"
        },
      ],
      "createdAt": 1517104935042,
      "isMultipleOfGCD": true,
      "stepList": [[], []],
    };
    diehard.findSolutions = jest.fn();
    diehard.findSolutions.mockReturnValue(data);
    expect(solve.create("3-5-4", jest.fn())).toMatchSnapshot();
  });
});