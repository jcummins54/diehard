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
      "results": [
        "Round 1: Step 9 - Target 4 achieved! hash: { jugs: [0, 4], nextAction: \"fill\", nextJug: \"jug 1\" }",
        "Round 2: Step 7 - Target 4 achieved! hash: { jugs: [3, 4], nextAction: \"pour\", nextJug: \"jug 1\" }",
      ],
      "stepList": [[], []],
      "winner": 2,
    };
    diehard.findSolutions = jest.fn();
    diehard.findSolutions.mockReturnValue({ ...data });
    expect(solve.create("3-5-4", jest.fn())).toMatchSnapshot();
  });
});