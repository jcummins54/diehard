module.exports.findSolutions = (id) => {
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
  let winner = null;

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
    const hash = `{ jugs: [${jugs[0].amount}, ${jugs[1].amount}], nextAction: "${nextAction}", nextJug: "${nextJug.name}" }`;

    count += 1;

    if (jug.amount === target || other.amount === target) {
      endRound(count, `Target ${target} achieved!`, hash);
      return count;
    }

    stepList[round - 1].push(hash);

    if (stepMap[round - 1][hash]) {
      endRound(count, "No answer found. Repeated", hash);
      return count;
    }
    stepMap[round - 1][hash] = true;

    // Don't hit the call stack
    if (count === 3756) {
      // We don't need to save this to the db
      stepList[round - 1] = [];
      endRound(count, "No answer found.", hash);
      return count;
    }
    return step(nextJug, nextAction, count);
  }

  function endRound(count, result, hash) {
    // const roundResults = {
    //   count: count,
    //   result: result,
    //   hash: hash,
    // };
    // results.push(roundResults);
    results.push(`Round ${round}: Step ${count} - ${result} hash: ${hash}`);
    round++;
  }

  // Round 1
  const count1 = step(jugs[0], "fill", 1);

  // Reset
  jugs[0].amount = jugs[1].amount = 0.0;

  // Round 2
  const count2 = step(jugs[1], "fill", 1);
  if (count1 !== count2) {
    winner = (count1 < count2) ? 1 : 2;
  }

  return {
    winner: winner,
    results: results,
    stepList: stepList,
  };
};