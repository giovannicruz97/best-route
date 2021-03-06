const { Router } = require('express');
const validator = require('express-joi-validation').createValidator({
  passError: true,
});
const {
  createAirportConnectionsSchema,
  getBestRouteSchema,
} = require('./airport-schema');
const {
  createAirportConnections,
  getBestRoute,
} = require('./airport-controller');

const router = Router();

router.post(
  '/airports',
  validator.body(createAirportConnectionsSchema),
  createAirportConnections
);

router.get('/best-route', validator.query(getBestRouteSchema), getBestRoute);

module.exports = router;
