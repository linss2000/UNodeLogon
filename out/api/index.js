'use strict';
var express = require('express');
var router = express.Router();
router.use(function (req, res, next) {
    console.log("Access to API. Route: " + req.path);
    next();
});
router.use('/users', require('./users').UsersRouter);
router.use('/gifs', require('./gifs').GifsRouter);
router.use('/db', require('./mssql').DBRouter);
module.exports = { router: router };
//# sourceMappingURL=index.js.map