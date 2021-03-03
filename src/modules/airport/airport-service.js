const fs = require('fs');

const inputRoutesFileName =
  process.env.INPUT_ROUTES_FILE_NAME || 'input-routes.csv';

const registerRoute = async ({ origin, destination, value }) => {
  try {
    const line = `${origin},${destination},${value}\n`;
    fs.appendFileSync(`${__dirname}/artifacts/${inputRoutesFileName}`, line);

    return `Route ${origin} to ${destination} for ${value}`;
  } catch (err) {
    console.error(err);
  }
};

const groupAirports = async ({ rows }) => {
  const nodes = {};

  for (row of rows) {
    const [origin, destination, value] = row.split(',');
    const newDestination = {
      [destination]: parseInt(value, 10),
    };

    nodes[origin] = { ...nodes[origin], ...newDestination };
  }

  return nodes;
};

const extractAirpoirtsFromCsv = async () => {
  try {
    const csv = fs.readFileSync(
      `${__dirname}/artifacts/${inputRoutesFileName}`
    );

    const csvArray = csv.toString().split('\n');
    csvArray.pop();

    return groupAirports({ rows: csvArray });
  } catch (err) {
    console.log(err);
  }
};

const findLowestCostNode = (costs, processed) => {
  const knownNodes = Object.keys(costs);

  const lowestCostNode = knownNodes.reduce((lowest, node) => {
    if (lowest === null && !processed.includes(node)) {
      lowest = node;
    }
    if (costs[node] < costs[lowest] && !processed.includes(node)) {
      lowest = node;
    }
    return lowest;
  }, null);

  return lowestCostNode;
};

const findBestRoute = async ({ origin, destination }) => {
  const airpoirts = await extractAirpoirtsFromCsv();

  // Set expected heuristic value
  const trackedCosts = {
    [destination]: Infinity,
    ...airpoirts[origin],
  };

  // Get the parent value for the initial nodes
  const trackedParents = { [destination]: null };
  for (let child in airpoirts[origin]) {
    trackedParents[child] = origin;
  }

  const processedNodes = [];

  // Get initial and lowest cost node.
  let node = findLowestCostNode(trackedCosts, processedNodes);

  while (node) {
    let costToReachNode = trackedCosts[node];
    let childrenOfNode = airpoirts[node];

    for (let child in childrenOfNode) {
      let costFromNodetoChild = childrenOfNode[child];
      let costToChild = costToReachNode + costFromNodetoChild;

      if (!trackedCosts[child] || trackedCosts[child] > costToChild) {
        trackedCosts[child] = costToChild;
        trackedParents[child] = node;
      }
    }

    processedNodes.push(node);

    node = findLowestCostNode(trackedCosts, processedNodes);
  }

  let bestRoute = [destination];
  let parent = trackedParents[destination];
  while (parent) {
    bestRoute.push(parent);
    parent = trackedParents[parent];
  }
  bestRoute.reverse();

  return {
    cost: trackedCosts[destination],
    route: bestRoute,
  };
};

module.exports = { registerRoute, extractAirpoirtsFromCsv, findBestRoute };
