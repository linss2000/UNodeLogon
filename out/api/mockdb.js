"use strict";
var MockDB = (function () {
    function MockDB(defaultData) {
        if (defaultData === void 0) { defaultData = []; }
        this.data = defaultData;
    }
    MockDB.prototype.get = function (id) {
        if (typeof id === 'number') {
            return this.data[id];
        }
        return this.data.map(function (user, idx) {
            user.id = idx;
            return user;
        });
    };
    MockDB.prototype.update = function (idOrUser, user) {
        if (typeof idOrUser === 'number') {
            this.data[idOrUser] = this.clone(user);
            return idOrUser;
        }
        else {
            this.data.push(this.clone(idOrUser));
            return this.data.length - 1;
        }
    };
    MockDB.prototype.remove = function (id) {
        this.data.splice(id, 1);
        return {};
    };
    MockDB.prototype.clone = function (obj) {
        return JSON.parse(JSON.stringify(obj));
    };
    return MockDB;
}());
exports.MockDB = MockDB;
exports.MOCK_USERS = [
    {
        username: 'richard',
        name: 'Richard Hendricks',
        role: 'admin'
    },
    {
        username: 'erlich',
        name: 'Erlich Bachman',
        role: 'admin'
    }
];
//# sourceMappingURL=mockdb.js.map