const express = require('express');
const routes = require('./routes');
const { requestValidator } = require('./modules/error/handler');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);
app.use(requestValidator);

module.exports = app;
