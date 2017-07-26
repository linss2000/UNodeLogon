"use strict";
var express_1 = require("express");
var mockdb_1 = require("./mockdb");
var mysql = require("mysql");
//import * as async from "async";
var db = new mockdb_1.MockDB(mockdb_1.MOCK_USERS);
var Users = (function () {
    function Users() {
    }
    Users.prototype.get = function (req, res, next) {
        var data = db.get();
        res.send(200, { data: data });
    };
    Users.prototype.getUser = function (req, res, next) {
        var userid = req.params.userid;
        var pwd = req.params.pwd;
        var con = mysql.createConnection({
            host: "127.0.0.1",
            database: "HVS",
            user: "root",
            password: "galaxy",
            multipleStatements: true
        });
        con.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });
        con.query('SET @userid="' + userid + '"; set @pwd="' + pwd + '"; CALL sps_checkUser(@userid,@pwd)', function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send("Error " + err);
            }
            //if (err) throw err;
            res.status(200).send(JSON.stringify(rows[2]));
            console.log('Data received from Db:\n');
            console.log(rows);
        });
        con.end(function (err) {
            // The connection is terminated gracefully
            // Ensures all previously enqueued queries are still
            // before sending a COM_QUIT packet to the MySQL server.
        });
        //res.send(200, db.get(id));
    };
    Users.prototype.addUser = function (req, res, next) {
        var userid = req.params.userid;
        var pwd = req.params.pwd;
        var fname = req.params.fname;
        var lname = req.params.lname;
        var age = req.params.age;
        var address = req.params.address;
        var con = mysql.createConnection({
            host: "localhost",
            database: "mygalaxy",
            user: "root",
            password: "welcome",
            multipleStatements: true
        });
        con.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });
        con.query('SET @lname="' + lname + '"; SET @fname="' + fname + '"; SET @age="' + age + '"; SET @address="' + address + '"; set @userid="' + userid + '"; set @pwd="' + pwd + '"; CALL spi_tuser(@lname,@fname,@age,@address,@userid,@pwd)', function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send("Error " + err);
            }
            //if (err) throw err;
            res.status(200).send(JSON.stringify(rows[6]));
            console.log('Data received from Db:\n');
            console.log(rows);
        });
        con.end(function (err) {
            // The connection is terminated gracefully
            // Ensures all previously enqueued queries are still
            // before sending a COM_QUIT packet to the MySQL server.
        });
        //res.send(200, db.get(id));
    };
    Users.prototype.getData = function (req, res, next) {
        var id = parseInt(req.params.id, 10);
        next();
        //res.send(200, "Hello" + +id);
        //res.status(200).send( "Hello" + +id);
    };
    Users.prototype.sendData = function (req, res, next) {
        // First you need to create a connection to the db
        var con = mysql.createConnection({
            host: "localhost",
            database: "mygalaxy",
            user: "root",
            password: "welcome",
            multipleStatements: true
        });
        con.connect(function (err) {
            if (err) {
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });
        con.query('SET @id="RR"; CALL sps_getUsers(@id)', function (err, rows) {
            if (err)
                throw err;
            res.status(200).send(JSON.stringify(rows[1]));
            console.log('Data received from Db:\n');
            console.log(rows);
        });
        /*
        con.query(
          'UPDATE tuser SET gs_address = ? Where gs_Id = ?',
          ["South Africa", 4],
          function (err, result) {
            if (err) throw err;
  
            console.log('Changed ' + result.changedRows + ' rows');
          }
        );
  
        con.query(
          'DELETE FROM tuser WHERE gs_id = ?',
          [5],
          function (err, result) {
            //if (err) throw err;
            if(err){
              res.status(500).send("Error " + err);
            }
            console.log('Deleted ' + result.affectedRows + ' rows');
          }
        );
  
        let employee = { gs_last_name: 'Pagtalunan', gs_first_name: 'Rouel', gs_age:45, gs_address: '3 Everywhere'};
        con.query('INSERT INTO tuser SET ?', employee, function(err,res){
          if(err) throw err;
          console.log('Last insert ID:', res.insertId);
        });
  
        
        con.query('SELECT * FROM tuser',function(err,rows){
          //if(err) throw new err;
          if(err){
            res.status(500).send("Error " + err);
          }
          console.log('Data received from Db:\n');
          res.status(200).send("Hello Data " + JSON.stringify(rows));
          //res.json(JSON.stringify(rows));
          //console.log(rows);
          //res.status(200).send("Hello Data " + JSON.stringify(rows));
        });
        */
        con.end(function (err) {
            // The connection is terminated gracefully
            // Ensures all previously enqueued queries are still
            // before sending a COM_QUIT packet to the MySQL server.
        });
        //let id = parseInt(req.params.id,10);
        //res.status(200).send("Hello sendData" + +id);
        //res.send(200, "Hello sendData" + +id);
    };
    return Users;
}());
exports.Users = Users;
var users = new Users();
exports.UsersRouter = express_1.Router();
exports.UsersRouter.get('/', users.get);
exports.UsersRouter.post('/:userid/:pwd/:fname/:lname/:age/:address', users.addUser);
exports.UsersRouter.post('/:userid/:pwd', users.getUser);
//UsersRouter.get('/test/:id', users.sendData);
exports.UsersRouter.post('/test', users.sendData);
//UsersRouter.get('/test/:id', [users.getData, users.sendData]);
//# sourceMappingURL=users.js.map