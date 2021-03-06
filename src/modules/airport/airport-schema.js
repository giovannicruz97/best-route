const Joi = require('joi');

const createAirportConnectionsSchema = Joi.object({
  airports: Joi.array()
    .items(
      Joi.object({
        origin: Joi.string().required(),
        destinations: Joi.array()
          .items(
            Joi.object({
              destination: Joi.string().required(),
              cost: Joi.number().positive().integer().required(),
            })
          )
          .required(),
      })
    )
    .required(),
}).required();

const getBestRouteSchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
}).required();

module.exports = { createAirportConnectionsSchema, getBestRouteSchema };
