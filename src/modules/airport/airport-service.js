const fs = require('fs');
const path = require('path');

const defaultInputRoutesFileName =
  process.env.INPUT_ROUTES_FILE_NAME || 'input-routes.csv';

const registerRoute = async ({ origin, destination, cost, file = null }) => {
  try {
    if (typeof cost != 'number') {
      throw new Error('cost is not a number');
    }

    const line = `${origin},${destination},${cost}\n`;
    const csv = file || `${__dirname}/artifacts/${defaultInputRoutesFileName}`;
    fs.appendFileSync(csv, line);

    return `${origin} -> ${destination}: ${cost}`;
  } catch (err) {
    process.env.NODE_ENV !== 'test' ? console.error(err) : null;

    return err;
  }
};

const groupAirports = async ({ rows }) => {
  const nodes = {};

  try {
    for (const [index, row] of rows.entries()) {
      const [origin, destination, cost] = row.split(',');

      if (!origin || !destination || !cost) {
        throw new Error(`Row ${index + 1} is not separated by commas`);
      }

      const newDestination = {
        [destination]: parseInt(cost, 10),
      };

      nodes[origin] = { ...nodes[origin], ...newDestination };
    }

    return nodes;
  } catch (err) {
    process.env.NODE_ENV !== 'test' ? console.error(err) : null;

    return err;
  }
};

const extractAirpoirtsFromCsv = async ({ file = null }) => {
  try {
    const csvFile =
      file || `${__dirname}/artifacts/${defaultInputRoutesFileName}`;

    if (path.extname(csvFile) !== '.csv') {
      throw new Error('The given file is not a csv');
    }

    const csv = fs.readFileSync(csvFile);
    const csvArray = csv.toString().split('\n');
    csvArray.pop();

    return groupAirports({ rows: csvArray });
  } catch (err) {
    process.env.NODE_ENV !== 'test' ? console.error(err) : null;

    return err;
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

const findBestRoute = async ({ origin, destination, file = null }) => {
  const airpoirts = await extractAirpoirtsFromCsv({ file });

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

  if (trackedCosts[destination] === Infinity) {
    throw new Error(`Route to ${destination} from ${origin} does not exist`);
  }

  return {
    cost: trackedCosts[destination],
    route: bestRoute,
  };
};

module.exports = { registerRoute, extractAirpoirtsFromCsv, findBestRoute };
