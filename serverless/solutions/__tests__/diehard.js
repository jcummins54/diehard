import {
  initData,
  doAction,
  buildStepData,
  step,
  endRound,
  findSolutions,
  findWinner,
} from "../diehard";

jest.mock("aws-sdk");

describe("initData", () => {
  it("should initialize the data object", () => {
    const data = initData("3-5-4");
    expect(data).toMatchObject({
      goal: 4,
      stepMap: [ [], [] ],
      stepList: [ [], [] ],
      results: [],
      round: 1,
      jugs: [
        { name: "jug 1", amount: 0, size: 3 },
        { name: "jug 2", amount: 0, size: 5 },
      ],
    });
  });
});

describe("doAction", () => {
  it("should empty target jug 2", () => {
    const data = initData("3-5-4");
    data.jugs[0] = { name: "jug 1", amount: 1, size: 3 };
    data.jugs[1] = { name: "jug 2", amount: 5, size: 5 };
    const expectedResult = {
      nextAction: "pour",
      nextJugIndex: 0,
      data: {
        goal: 4,
        stepMap: [[], []],
        stepList: [[], []],
        results: [],
        round: 1,
        jugs: [
          { name: "jug 1", amount: 1, size: 3 },
          { name: "jug 2", amount: 0, size: 5 },
        ],
      },
    };
    expect(doAction("empty", 1, data)).toMatchObject(expectedResult);
  });

  it("should pour target jug 1 into other jug 2", () => {
    const data = initData("3-5-4");
    data.jugs[0] = { name: "jug 1", amount: 1, size: 3 };
    data.jugs[1] = { name: "jug 2", amount: 0, size: 5 };
    const expectedResult = {
      nextAction: "fill",
      nextJugIndex: 0,
      data: {
        goal: 4,
        stepMap: [[], []],
        stepList: [[], []],
        results: [],
        round: 1,
        jugs: [
          { name: "jug 1", amount: 0, size: 3 },
          { name: "jug 2", amount: 1, size: 5 },
        ],
      },
    };
    expect(doAction("pour", 0, data)).toMatchObject(expectedResult);
  });

  it("should fill target jug 1", () => {
    const data = initData("3-5-4");
    data.jugs[0] = { name: "jug 1", amount: 0, size: 3 };
    data.jugs[1] = { name: "jug 2", amount: 1, size: 5 };
    const expectedResult = {
      nextAction: "pour",
      nextJugIndex: 0,
      data: {
        goal: 4,
        stepMap: [[], []],
        stepList: [[], []],
        results: [],
        round: 1,
        jugs: [
          { name: "jug 1", amount: 3, size: 3 },
          { name: "jug 2", amount: 1, size: 5 },
        ],
      },
    };
    expect(doAction("fill", 0, data)).toMatchObject(expectedResult);
  });
});

describe("buildStepData", () => {
  it("should build the record for a step", () => {
    const data = initData("3-5-4");
    data.jugs[0] = { name: "jug 1", amount: 0, size: 3 };
    data.jugs[1] = { name: "jug 2", amount: 1, size: 5 };
    const expectedResult = {
      jugs: [0, 1],
      nextAction: "pour",
      nextJug: "jug 1",
    };
    expect(buildStepData("pour", 0, data)).toMatchObject(expectedResult);
  });
});

describe("step", () => {
  it("should recursively step through actions until result is found", () => {
    let data = initData("2-5-4");
    data = step(0, "fill", 1, data);
    const expectedResult = {
      "goal": 4,
      "stepMap": [ [], [] ],
      "stepList": [
        [
          {
            "jugs": [ 2, 0 ],
            "nextAction": "pour",
            "nextJug": "jug 1",
          },
          {
            "jugs": [ 0, 2 ],
            "nextAction": "fill",
            "nextJug": "jug 1",
          },
          {
            "jugs": [ 2, 2 ],
            "nextAction": "pour",
            "nextJug": "jug 1",
          },
          {
            "jugs": [ 0, 4 ],
            "nextAction": "fill",
            "nextJug": "jug 1",
          },
        ],
        [],
      ],
      "results": [
        {
          "count": 5,
          "result": true,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
        },
      ],
      "round": 2,
      "jugs": [
        {
          "name": "jug 1",
          "amount": 0,
          "size": 2,
        },
        {
          "name": "jug 2",
          "amount": 4,
          "size": 5,
        },
      ],
    };
    expect(JSON.stringify(data)).toStrictEqual(JSON.stringify(expectedResult));
  });
});

describe("endRound", () => {
  it("should append the round result and increment the round counter", () => {
    const data = initData("3-5-4");
    data.jugs[0] = { name: "jug 1", amount: 0, size: 3 };
    data.jugs[1] = { name: "jug 2", amount: 1, size: 5 };
    const stepData = {
      "jugs": [0, 4],
      "nextAction": "fill",
      "nextJug": "jug 1",
    };
    const hash = JSON.stringify(stepData);
    const expectedResult = {
      goal: 4,
      stepMap: [[], []],
      stepList: [[], []],
      results: [
        {
          count: 9,
          result: true,
          hash: "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
        },
      ],
      round: 2,
      jugs: [
        { name: "jug 1", amount: 0, size: 3 },
        { name: "jug 2", amount: 1, size: 5 },
      ],
    };
    expect(endRound(9, true, hash, data)).toMatchObject(expectedResult);
  });
});

describe("findWinner", () => {  
  it("should return '1' when the first result count is lower", () => {
    const data = {
      "results": [
        {
          "count": 7,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
        {
          "count": 9,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
      ],
    };
    expect(findWinner(data)).toBe("1");
  });

  it("should return '2' when the second result count is lower", () => {
    const data = {
      "results": [
        {
          "count": 9,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
        {
          "count": 7,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
      ],
    };
    expect(findWinner(data)).toBe("2");
  });

  it("should return '1' when there is only a first result", () => {
    const data = {
      "results": [
        {
          "count": 9,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
        {
          "count": 7,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}",
          "result": false,
        },
      ],
    };
    expect(findWinner(data)).toBe("1");
  });

  it("should return 'tie' when both results have the same count", () => {
    const data = {
      "results": [
        {
          "count": 7,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
        {
          "count": 7,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}",
          "result": true,
        },
      ],
    };
    expect(findWinner(data)).toBe("tie");
  });

  it("should return 'no solution' when there aren't results", () => {
    const data = {
      "results": [
        {
          "count": 9,
          "hash": "{\"jugs\":[0,4],\"nextAction\":\"fill\",\"nextJug\":\"jug 1\"}",
          "result": false,
        },
        {
          "count": 7,
          "hash": "{\"jugs\":[3,4],\"nextAction\":\"pour\",\"nextJug\":\"jug 1\"}",
          "result": false,
        },
      ],
    };
    expect(findWinner(data)).toBe("no solution");
  });
});

describe("findSolutions", () => {
  it("should solve the puzzle 3-5-4", () => {
    const solutions = findSolutions("3-5-4");    
    expect(solutions).toMatchSnapshot();
  });

  it("should solve the puzzle 11-4-7", () => {
    const solutions = findSolutions("11-4-7");
    expect(solutions).toMatchSnapshot();
  });
});
