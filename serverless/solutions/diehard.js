module.exports.findSolutions = (id) => {
  const RECURSION_LIMIT = 3756;

  const parts = id.split("-");
  if (parts.length !== 3) {
    return "error";
  }

  const target = parseFloat(parts[2]);

  let jugs = [
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
  ];

  let stepMap = [[], []];
  let stepList = [[], []];
  let results = [];
  let round = 1;

  function doAction(action, targetJug, otherJug) {
    let nextAction = "empty";
    let nextJug = otherJug;
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
          nextJug = targetJug;
        } else {
          if (otherJug.amount < otherJug.size) {
            nextAction = "pour";
            nextJug = targetJug;
          } else {
            nextAction = "empty";
          }
        }
        break;

      case "pour":
        otherRoom = +(otherJug.size - otherJug.amount).toFixed(5);
        if (otherRoom >= targetJug.amount) {
          otherJug.amount = +(otherJug.amount + targetJug.amount).toFixed(5);
          targetJug.amount = 0;
        } else {
          targetJug.amount = +(targetJug.amount - otherRoom).toFixed(5);
          otherJug.amount = otherJug.size;
        }
        if (otherJug.amount > targetJug.amount) {
          if (targetJug.amount === 0) {
            nextAction = "fill";
            nextJug = targetJug;
          } else {
            nextAction = "empty";
          }
        } else {
          nextAction = "pour";
        }
        break;
    }

    return [nextAction, nextJug];
  }

  // empty jug, fill jug, pour into other jug
  function step(jug, action, count) {
    const other = (jug === jugs[0]) ? jugs[1] : jugs[0];
    const actionResult = doAction(action, jug, other);
    const nextAction = actionResult[0];
    const nextJug = actionResult[1];
    const stepData = {
      jugs: [jugs[0].amount, jugs[1].amount],
      nextAction: nextAction,
      nextJug: nextJug.name,
    };
    const hash = JSON.stringify(stepData);

    count += 1;

    if (jug.amount === target || other.amount === target) {
      endRound(count, true, hash);
      return count;
    }

    stepList[round - 1].push(stepData);

    if (stepMap[round - 1][hash]) {
      endRound(count, false, hash);
      return count;
    }
    stepMap[round - 1][hash] = true;

    // Don't hit the call stack
    if (count === RECURSION_LIMIT) {
      // We don't need to save this to the db
      stepList[round - 1] = [];
      endRound(count, false, hash);
      return count;
    }
    return step(nextJug, nextAction, count);
  }

  function endRound(count, result, hash) {
    const roundResults = {
      count: count,
      result: result,
      hash: hash,
    };
    results.push(roundResults);
    round++;
  }

  // Round 1
  step(jugs[0], "fill", 1);

  // Reset
  jugs[0].amount = jugs[1].amount = 0.0;

  // Round 2
  step(jugs[1], "fill", 1);

  function findWinner() {
    if (!results[0].result && !results[1].result) {
      // No solution
      return "no solution";
    } else if (results[0].result && results[1].result) {
      // Both have a solution
      if (results[0].count === results[1].count) {
        return "tie";
      }
      return (results[0].count < results[1].count) ? "1" : "2";
    } else if (results[0].result) {
      // Only 1 has a solution
      return "1";
    }
    // Only 2 has a solution
    return "2";
  }

  const winner = findWinner();

  return {
    winner: winner,
    results: results,
    stepList: stepList,
  };
};