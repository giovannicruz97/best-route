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

    const nodeExists = !!nodes[origin];
    if (!nodeExists) {
      nodes[origin] = [newDestination];
    }

    if (nodeExists) {
      nodes[origin].push(newDestination);
    }
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

module.exports = { registerRoute, extractAirpoirtsFromCsv };
