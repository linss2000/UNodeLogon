'use strict';
const express = require('express');
let router = express.Router();

router.use((req, res, next) => {
    console.log(`Access to API. Route: ${req.path}`);
    next();
});

router.use('/db', require('./mssql').DBRouter);

module.exports = { router };