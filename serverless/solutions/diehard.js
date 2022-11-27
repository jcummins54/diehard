import gcd from "gcd";

// Set a recursion limit to avoid runaway recursion
const RECURSION_LIMIT = 3000;

/**
 * 
 * @param id - a string of 3 numbers separated by dashes like "3-5-4"
 * which represents the size of the jug 1, size of jug 2, and the target amount
 * we are trying to reach. Decimal amounts are allowed.
 * 
 * @returns data object
 */
export function initData(id) {
  const parts = id.split("-");
  const goal = parseFloat(parts[2]);

  return {
    goal,
    stepMap: [[], []],
    stepList: [[], []],
    results: [],
    round: 1,
    jugs: [
      {
        name: "jug 1",
        amount: 0.0,
        size: parseFloat(parts[0]),
      },
      {
        name: "jug 2",
        amount: 0.0,
        size: parseFloat(parts[1]),
      },
    ],
  };
}

export function doAction(action, jugIndex, data) {
  const targetJug = data.jugs[jugIndex];
  const otherIndex = jugIndex === 0 ? 1 : 0;
  const otherJug = data.jugs[otherIndex];

  let nextAction = "empty";
  let nextJugIndex = otherIndex;
  let otherRoom = 0;

  switch (action) {
    case "empty":
      targetJug.amount = 0;
      nextAction = "pour";
      break;

    case "fill":
      targetJug.amount = targetJug.size;
      if (otherJug.amount === 0) {
        nextAction = "pour";
        nextJugIndex = jugIndex;
      } else {
        if (otherJug.amount < otherJug.size) {
          nextAction = "pour";
          nextJugIndex = jugIndex;
        } else {
          nextAction = "empty";
        }
      }
      break;

    case "pour":
      otherRoom = +(otherJug.size - otherJug.amount).toFixed(2);
      if (otherRoom >= targetJug.amount) {
        otherJug.amount = +(otherJug.amount + targetJug.amount).toFixed(2);
        targetJug.amount = 0;
      } else {
        targetJug.amount = +(targetJug.amount - otherRoom).toFixed(2);
        otherJug.amount = otherJug.size;
      }
      if (otherJug.amount > targetJug.amount) {
        if (targetJug.amount === 0) {
          nextAction = "fill";
          nextJugIndex = jugIndex;
        } else {
          nextAction = "empty";
        }
      } else {
        nextAction = "pour";
      }
      break;
  }

  return { nextAction, nextJugIndex, data };
}

// Build the record for the last step taken
export function buildStepData(nextAction, nextJugIndex, data) {
  return {
    jugs: [data.jugs[0].amount, data.jugs[1].amount],
    nextAction,
    nextJug: data.jugs[nextJugIndex].name,
  };
}

export function endRound(count, result, hash, data) {  
  data.results.push({
    count: count,
    result: result,
    hash: hash,
  });

  data.round++;

  return data;
}

// empty jug, fill jug, pour into other jug
export function step(jugIndex, action, count, data) {
  const targetJug = data.jugs[jugIndex];
  const otherJug = (targetJug === data.jugs[0]) ? data.jugs[1] : data.jugs[0];
  const actionResult = doAction(action, jugIndex, data);
  const { nextAction, nextJugIndex } = actionResult;
  data = actionResult.data;
  const stepData = buildStepData(nextAction, nextJugIndex, data);
  const hash = JSON.stringify(stepData);
  data.stepList[data.round - 1].push(stepData);
  count++;

  if (targetJug.amount === data.goal || otherJug.amount === data.goal) {
    data = endRound(count, true, hash, data);

    return data;
  }

  // State previously reached. No need to continue.
  if (data.stepMap[data.round - 1][hash]) {
    data = endRound(count, false, hash, data);

    return data;
  }
  data.stepMap[data.round - 1][hash] = true;

  // Don't hit the call stack
  if (count === RECURSION_LIMIT) {
    // We don't need to save this to the db
    data.stepList[data.round - 1] = [];
    data = endRound(count, false, hash, data);

    return data;
  }

  return step(nextJugIndex, nextAction, count, data);
}

export function findWinner(data) {
  if (
    data.results.length !== 2 ||
    (!data.results[0].result && !data.results[1].result)
  ) {
    // No solution
    return "no solution";
  } else if (data.results[0].result && data.results[1].result) {
    // Both have a solution
    if (data.results[0].count === data.results[1].count) {
      return "tie";
    }
    return (data.results[0].count < data.results[1].count) ? "1" : "2";
  } else if (data.results[0].result) {
    // Only 1 has a solution
    return "1";
  }
  
  // Only 2 has a solution
  return "2";
}

export function findSolutions(id) {
  let data = initData(id);

  // the greatest common denominator will tell us if there is a solution
  // Times 1000 to support 3 decimal places
  const gcdVal = gcd(data.jugs[0].size * 1000, data.jugs[1].size * 1000);
  const targetModulus = (data.goal * 1000) % gcdVal;
  // if targetModulus !== 0 we could return no solution, 
  // but seems more interesting to see the count before hash repeats.

  // Round 1 - start by filling the first jug
  data = step(0, "fill", 1, data);

  // Reset
  data.jugs[0].amount = data.jugs[1].amount = 0.0;

  // Round 2 - start by filling the second jug
  data = step(1, "fill", 1, data);

  const winner = findWinner(data);

  return {
    isMultipleOfGCD: (targetModulus === 0),
    winner: winner,
    results: data.results,
    stepList: data.stepList,
  };
}
