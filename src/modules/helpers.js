import Joi from 'joi';

const validateOptions = {
  abortEarly: false,
};

/**
 * Validate the params on the request.
 * If some value does not match with schema, return the response of the request with the errors.
 *
 * @param {*} schema - Schema of the parameter.
 * @param {*} name - Name of the value that needs to match with the schema.
 */
const validateParam = (schema, name) => (req, res, next) => {
  const result = Joi.validate({ [name]: req.params[name] }, schema);
  if (result.error) {
    return res.status(400).json(result.error);
  }

  return next();
};

/**
 * Validate the payload on the request.
 * If some value does not match with schema, return the response of the request with the errors.
 *
 * @param {*} schema - Schema of the payload.
 */
const validateBody = (schema) => (req, res, next) => {
  const result = Joi.validate(req.body, schema, validateOptions);

  if (result.error) {
    const errors = result.error.details.reduce(
      (acc, curr) =>
        acc.concat({ path: curr.path.join('.'), message: curr.message }),
      []
    );

    return res.status(400).send(errors);
  }

  return next();
};

/**
 * Validate the object.
 * If some value does not match with schema, return an array of errors.
 *
 * @param {Object} object - Object that will be validate.
 * @param {Object} schema - Schema of the object
 */
const validateObject = (object, schema) => {
  const result = Joi.validate(object, schema, validateOptions);

  if (result.error) {
    return result.error.details.reduce(
      (acc, curr) =>
        acc.concat({ path: curr.path.join('.'), message: curr.message }),
      []
    );
  }
  return [];
};

module.exports = { validateBody, validateParam, validateObject };
