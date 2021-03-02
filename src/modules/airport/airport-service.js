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

const groupAirports = async ({ nodes }) => {
  const possiblePaths = {};

  for (node of nodes) {
    const [origin, destination, value] = node.split(',');
    const newNode = {
      [destination]: parseInt(value, 10),
    };

    const nodeExists = !!possiblePaths[origin];
    if (!nodeExists) {
      possiblePaths[origin] = [newNode];
    }

    if (nodeExists) {
      possiblePaths[origin].push(newNode);
    }
  }

  return possiblePaths;
};

const extractAirpoirtsFromCsv = async () => {
  try {
    const csv = fs.readFileSync(
      `${__dirname}/artifacts/${inputRoutesFileName}`
    );

    const csvArray = csv.toString().split('\n');
    csvArray.pop();

    return groupAirports({ nodes: csvArray });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { registerRoute, extractAirpoirtsFromCsv };
