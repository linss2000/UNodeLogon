'use strict';
const express = require('express');
let router = express.Router();

router.use((req, res, next) => {
    console.log(`Access to API. Route: ${req.path}`);
    next();
});

router.use('/users', require('./users').UsersRouter);
router.use('/gifs', require('./gifs').GifsRouter);
router.use('/db', require('./mssql').DBRouter);

module.exports = { router };