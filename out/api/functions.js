"use strict";
var _getTimeStamp = function () {
    var now = new Date();
    return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':' +
        ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
        .getSeconds()) : (now.getSeconds())));
};
var _myName = function () {
    return _getTimeStamp();
};
module.exports = {
    getTimeStamp: _getTimeStamp
};
//# sourceMappingURL=functions.js.map