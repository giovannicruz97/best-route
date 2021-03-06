const fs = require('fs');
const path = require('path');

const defaultInputRoutesFileName =
  process.env.INPUT_ROUTES_FILE_NAME || 'input-routes.csv';

const getLastCsvFile = async () => {
  try {
    const csvLocations = fs.readFileSync(
      `${__dirname}/artifacts/csvLocations.txt`
    );

    let lastCsvFileLocation = csvLocations.toString().split('\n');
    lastCsvFileLocation.pop();
    lastCsvFileLocation = lastCsvFileLocation.pop();

    return !lastCsvFileLocation
      ? `${__dirname}/artifacts/${defaultInputRoutesFileName}`
      : lastCsvFileLocation;
  } catch (err) {
    if (err.code === 'ENOENT') {
      err.message = 'File not found';
    }
    process.env.TOGGLE_LOGS === 'on' ? console.error(err) : null;

    return err;
  }
};

const connectOriginToDestinations = async ({ origin, destinations }) =>
  Promise.all(
    destinations.map(
      async ({ destination, cost }) =>
        await registerRoute({
          origin,
          destination,
          cost,
        })
    )
  );

const connectAirports = async ({ airports }) => {
  let connections = [];
  for (airport of airports) {
    const { origin, destinations } = airport;

    const registeredConnections = await connectOriginToDestinations({
      origin,
      destinations,
    });

    const foundError = registeredConnections.find(
      (connection) => connection instanceof Error
    );

    if (foundError) {
      throw new Error(foundError.message);
    }

    connections.push(registeredConnections);
  }

  connections.reverse();

  return connections.flat();
};

const registerRoute = async ({ origin, destination, cost }) => {
  try {
    if (typeof cost != 'number') {
      throw new Error('cost is not a number');
    }

    const line = `${origin},${destination},${cost}\n`;
    const csv = await getLastCsvFile();

    if (csv instanceof Error) {
      throw new Error(csv.message);
    }

    fs.appendFileSync(csv, line);

    return `${origin} -> ${destination}: ${cost}`;
  } catch (err) {
    process.env.TOGGLE_LOGS === 'on' ? console.error(err) : null;

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
    process.env.TOGGLE_LOGS === 'on' ? console.error(err) : null;

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
    if (err.code === 'ENOENT') {
      err.message = 'File not found';
    }
    process.env.TOGGLE_LOGS === 'on' ? console.error(err) : null;

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

  if (airpoirts instanceof Error) {
    throw new Error(airpoirts.message);
  }

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

module.exports = {
  registerRoute,
  extractAirpoirtsFromCsv,
  findBestRoute,
  connectAirports,
  getLastCsvFile,
};
