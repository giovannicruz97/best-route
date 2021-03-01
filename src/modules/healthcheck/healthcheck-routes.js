const { Router } = require('express');
const { getHealthcheck } = require('./healthcheck-controller');

const router = Router();

router.get('/_healthcheck', getHealthcheck);

module.exports = router;
