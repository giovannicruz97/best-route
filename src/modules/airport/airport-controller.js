const { statusCodes } = require('../error/handler');
const { connectAirports } = require('./airport-service');

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

module.exports = { createAirportConnections };
