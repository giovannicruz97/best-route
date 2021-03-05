const statusCodes = {
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

const requestValidator = (err, _, res, next) => {
  let joiError = false;
  if (err && err.error && err.error.isJoi) {
    joiError = true;
    res.status(statusCodes.BAD_REQUEST).json({
      message: err.error.toString(),
    });
  }

  if (!joiError) {
    next(err);
  }
};

module.exports = { statusCodes, requestValidator };
