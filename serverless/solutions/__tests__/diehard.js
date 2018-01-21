jest.unmock("../diehard");

let diehard;

beforeEach(() => {
  jest.resetModules();
  diehard = require("../diehard");
});

describe("findSolutions", () => {
  it("should solve the puzzle", () => {
    expect(diehard.findSolutions("3-5-4")).toMatchSnapshot();
    expect(diehard.findSolutions("11-4-7")).toMatchSnapshot();
  });
});