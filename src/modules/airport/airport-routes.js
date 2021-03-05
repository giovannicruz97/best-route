const { Router } = require('express');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const { createAirportConnectionsSchema } = require('./airport-schema');
const { createAirportConnections } = require('./airport-controller');

const router = Router();

router.post(
  '/airports',
  validator.body(createAirportConnectionsSchema),
  createAirportConnections
);

module.exports = router;
