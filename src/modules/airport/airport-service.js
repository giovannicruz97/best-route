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

module.exports = { registerRoute };
