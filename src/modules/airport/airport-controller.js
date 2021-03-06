const { statusCodes } = require('../error/handler');
const {
  connectAirports,
  findBestRoute,
  getLastCsvFile,
} = require('./airport-service');

const createAirportConnections = async (req, res) => {
  const { airports } = req.body;

  try {
    const connections = await connectAirports({ airports });

    res.json({
      data: {
        registered_connections: connections,
      },
    });
  } catch ({ message }) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message,
    });
  }
};

const getBestRoute = async (req, res) => {
  const { origin, destination } = req.query;

  try {
    const lastCsvFile = await getLastCsvFile();
    const { cost, route } = await findBestRoute({
      origin,
      destination,
      file: lastCsvFile,
    });

    res.json({
      data: {
        bestRoute: {
          cost,
          route: route.join(' -> '),
        },
      },
    });
  } catch ({ message }) {
    res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
      message,
    });
  }
};

module.exports = { createAirportConnections, getBestRoute };
