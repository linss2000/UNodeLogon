"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_1 = require("express");
var mssql = require("mssql");
var _ = require("lodash");
var config = require("config");
var username = require("username");
var os = require("os");
var EventEmitter = require("events");
/*
var winston = require('winston');
require('winston-mssql');

winston.add(winston.transports.mssql, {
    connectionString: "mssql://hvssql:hvssql@35.185.106.158/hvs",
    table: "tNodeLogs"
});
*/
//class MyEmitter extends EventEmitter{}
/*
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
*/
var env = process.env.NODE_ENV || "Dev";
//let pool =  new mssql.connect(config.get(env + ".dbConfig"));
console.log("NODE_CONFIG_DIR: " + config.util.getEnv("NODE_CONFIG_DIR"));
mssql.on("error", function (err) {
    console.log(err);
    // ... error handler
});
//import * as async from "async";
/*
const config : {} = {
    server: '10.2.1.35',
    database: 'Galaxy_Development',
    user: 'rread',
    password: 'galaxy',
    port: 1433,
    requestTimeout : 60000,
    pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
    }
}
*/
var _getTimeStamp = function () {
    var now = new Date();
    return (now.getMonth() +
        1 +
        "/" +
        now.getDate() +
        "/" +
        now.getFullYear() +
        " " +
        now.getHours() +
        ":" +
        (now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes()) +
        ":" +
        (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds()));
};
var Dbase = /** @class */ (function (_super) {
    __extends(Dbase, _super);
    function Dbase() {
        var _this = _super.call(this) || this;
        console.log("Created"); // error here
        return _this;
    }
    /*
      _getTimeStamp = () => {
          var now = new Date();
              return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
                              + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                              .getSeconds()) : (now.getSeconds())));
      };
      */
    Dbase.prototype.execSP = function (sqlProc, parms) {
        return __awaiter(this, void 0, void 0, function () {
            var headerSent, gs_start_tm, errDesc, gs_Err, parm, gs_end_tm, pool, rolledBack, result, transaction, req, hasOutput_1, output_parm_1, cnt_1, data, retObject, tmpData, err_1, tmpData, errObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        headerSent = false;
                        gs_start_tm = _getTimeStamp();
                        errDesc = "";
                        gs_Err = "";
                        parm = "";
                        gs_end_tm = "";
                        // this.emit('error', new Error('whoops!')); var dbConn = new
                        // mssql.Connection(config.get(env + ".dbConfig"));
                        try {
                            //mssql.close()
                        }
                        catch (_b) { }
                        pool = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
                        pool.on("error", function (err) {
                            console.log("SQL errors", err);
                        });
                        rolledBack = false;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 11, 15, 16]);
                        return [4 /*yield*/, pool.connect()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, new mssql.Transaction(pool)];
                    case 3:
                        transaction = _a.sent();
                        //transaction.begin(err =>  {
                        return [4 /*yield*/, transaction.begin()];
                    case 4:
                        //transaction.begin(err =>  {
                        _a.sent();
                        return [4 /*yield*/, transaction
                                .request()
                                .input("gs_sp_name", sqlProc)
                                .execute("sps_getSPParmNames")];
                    case 5:
                        //console.log("in transaction")
                        result = _a.sent();
                        console.log(result);
                        hasOutput_1 = false;
                        output_parm_1 = "";
                        return [4 /*yield*/, transaction.request()];
                    case 6:
                        req = _a.sent();
                        //req.multiple = true;
                        //if (result[0].length > 0) {
                        if (result.recordsets.length > 0) {
                            cnt_1 = 0;
                            result.recordset.forEach(function (val) {
                                var rec = JSON.parse(JSON.stringify(val));
                                // console.log(rec.ParameterName) console.log(rec.isOutput)
                                // console.log(parms[cnt])
                                if (_.trim(rec.isOutput) == "Y") {
                                    //console.log("in Out") console.log(rec.ParameterName)
                                    hasOutput_1 = true;
                                    parm += rec.ParameterName + " output,";
                                    output_parm_1 = rec.ParameterName;
                                    req.output(rec.ParameterName);
                                    //req.output("output_parameter");
                                }
                                else {
                                    if (!_.isUndefined(parms[cnt_1])) {
                                        parm += "'" + parms[cnt_1] + "',";
                                        req.input(rec.ParameterName, parms[cnt_1]);
                                    }
                                }
                                cnt_1 += 1;
                            });
                            if (_.trim(parm) != "") {
                                parm = parm.substr(0, parm.length - 1);
                            }
                        }
                        console.log(sqlProc + " " + parm);
                        return [4 /*yield*/, req.execute(sqlProc)];
                    case 7:
                        data = _a.sent();
                        gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
                        retObject = {};
                        retObject.errCode = "0";
                        retObject.errDesc = "";
                        retObject.data = data.recordsets;
                        retObject.returnValue = data.returnValue;
                        //console.log("output")
                        if (hasOutput_1) {
                            retObject.output = data.output;
                        }
                        else {
                            retObject.output = {};
                        }
                        return [4 /*yield*/, transaction.request()];
                    case 8:
                        //Log the database call
                        req = _a.sent();
                        req.input("gs_user_i", username.sync());
                        req.input("gs_oru_i", "NA");
                        req.input("gs_sql", sqlProc + " " + parm);
                        req.input("gs_strt_tm", gs_start_tm);
                        req.input("gs_end_tm", gs_end_tm);
                        req.input("gs_Err", gs_Err);
                        req.input("gs_err_desc", errDesc);
                        req.input("gs_web", os.hostname());
                        req.input("gs_token", "");
                        req.input("gs_object", "Node");
                        req.input("gs_method", "execSP");
                        req.input("gs_transaction_id", "0");
                        return [4 /*yield*/, req.execute("spi_tdblog_1")];
                    case 9:
                        tmpData = _a.sent();
                        return [4 /*yield*/, transaction.commit()];
                    case 10:
                        _a.sent();
                        //console.log(data)
                        //mssql.close()
                        return [2 /*return*/, JSON.stringify(retObject)];
                    case 11:
                        err_1 = _a.sent();
                        //9. console.log(err);
                        return [4 /*yield*/, transaction.rollback(function () {
                                console.log("%%%");
                                //console.log(err)
                            })];
                    case 12:
                        //9. console.log(err);
                        _a.sent();
                        //console.log(err.message);
                        errDesc = err_1.message;
                        gs_Err = "-100";
                        gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
                        return [4 /*yield*/, pool.request()];
                    case 13:
                        //Log the database call
                        req = _a.sent();
                        req.input("gs_user_i", username.sync());
                        req.input("gs_oru_i", "NA");
                        req.input("gs_sql", sqlProc + " " + parm);
                        req.input("gs_strt_tm", gs_start_tm);
                        req.input("gs_end_tm", gs_end_tm);
                        req.input("gs_Err", gs_Err);
                        req.input("gs_err_desc", errDesc);
                        req.input("gs_web", os.hostname());
                        req.input("gs_token", "");
                        req.input("gs_object", "Node");
                        req.input("gs_method", "execSP");
                        req.input("gs_transaction_id", "0");
                        return [4 /*yield*/, req.execute("spi_tdblog_1")];
                    case 14:
                        tmpData = _a.sent();
                        errObject = {};
                        errObject.errCode = "-100";
                        errObject.errDesc = errDesc;
                        errObject.data = [];
                        errObject.returnValue = "0";
                        errObject.output = {};
                        //mssql.close()
                        return [2 /*return*/, JSON.stringify(errObject)];
                    case 15:
                        mssql.close();
                        return [7 /*endfinally*/];
                    case 16: return [2 /*return*/];
                }
            });
        });
    };
    Dbase.prototype.execSQl = function (sql) {
        return __awaiter(this, void 0, void 0, function () {
            var SQL, headerSent, gs_start_tm, errDesc, gs_Err, parm, gs_end_tm, rolledBack, transaction, pool, res, data, retObject, tmpData, err_2, req, tmpData, errObject;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //4. console.log(req.body) let SQL = req.body.SQL;
                        console.log("execSQL");
                        SQL = sql;
                        console.log(SQL);
                        headerSent = false;
                        gs_start_tm = _getTimeStamp();
                        errDesc = "";
                        gs_Err = "";
                        parm = "";
                        gs_end_tm = "";
                        rolledBack = false;
                        pool = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
                        pool.on("error", function (err) {
                            console.log("SQL errors", err);
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, 14, 15]);
                        return [4 /*yield*/, pool.connect()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, new mssql.Transaction(pool)];
                    case 3:
                        //var request = new mssql.Request(dbConn);
                        transaction = _a.sent();
                        return [4 /*yield*/, transaction.begin()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, pool.request(transaction)];
                    case 5:
                        res = _a.sent();
                        //res.multiple = true;
                        console.log(SQL);
                        return [4 /*yield*/, res.query(SQL)];
                    case 6:
                        data = _a.sent();
                        return [4 /*yield*/, transaction.commit()];
                    case 7:
                        _a.sent();
                        gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
                        retObject = {};
                        retObject.errCode = "0";
                        retObject.errDesc = "";
                        retObject.data = data.recordsets;
                        retObject.returnValue = data.returnValue;
                        retObject.output = {};
                        return [4 /*yield*/, pool.request()];
                    case 8:
                        //Log the database call
                        res = _a.sent();
                        res.input("gs_user_i", username.sync());
                        res.input("gs_oru_i", "NA");
                        res.input("gs_sql", SQL);
                        res.input("gs_strt_tm", gs_start_tm);
                        res.input("gs_end_tm", gs_end_tm);
                        res.input("gs_Err", gs_Err);
                        res.input("gs_err_desc", errDesc);
                        res.input("gs_web", os.hostname());
                        res.input("gs_token", "");
                        res.input("gs_object", "Node");
                        res.input("gs_method", "execSP");
                        res.input("gs_transaction_id", "0");
                        return [4 /*yield*/, res.execute("spi_tdblog_1")];
                    case 9:
                        tmpData = _a.sent();
                        //mssql.close()
                        //console.log(data) let data = await request.query(SQL)
                        return [2 /*return*/, JSON.stringify(retObject)];
                    case 10:
                        err_2 = _a.sent();
                        //9. console.log(err);
                        return [4 /*yield*/, transaction.rollback()];
                    case 11:
                        //9. console.log(err);
                        _a.sent();
                        errDesc = err_2.message;
                        gs_Err = "-100";
                        gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
                        return [4 /*yield*/, pool.request()];
                    case 12:
                        req = _a.sent();
                        req.input("gs_user_i", username.sync());
                        req.input("gs_oru_i", "NA");
                        req.input("gs_sql", SQL);
                        req.input("gs_strt_tm", gs_start_tm);
                        req.input("gs_end_tm", gs_end_tm);
                        req.input("gs_Err", gs_Err);
                        req.input("gs_err_desc", errDesc);
                        req.input("gs_web", os.hostname());
                        req.input("gs_token", "");
                        req.input("gs_object", "Node");
                        req.input("gs_method", "execSP");
                        req.input("gs_transaction_id", "0");
                        return [4 /*yield*/, req.execute("spi_tdblog_1")];
                    case 13:
                        tmpData = _a.sent();
                        errObject = {};
                        errObject.errCode = "-100";
                        errObject.errDesc = errDesc;
                        errObject.data = [];
                        errObject.returnValue = "0";
                        errObject.output = {};
                        //throw new Error("Error Occured");
                        //mssql.close()
                        return [2 /*return*/, JSON.stringify(errObject)];
                    case 14:
                        mssql.close();
                        return [7 /*endfinally*/];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    Dbase.prototype.eSQL = function (req, res, next) {
        /*
            let config = {
                server: '10.2.1.35',
                database: 'Galaxy_Development',
                user: 'rread',
                password: 'galaxy',
                port: 1433
            };
            */
        //4. console.log(req.body)
        var SQL = "select top 1 gs_document_name, gs_document from tleaveappdocs";
        console.log(SQL);
        var headerSent = false;
        var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
        //5.
        dbConn
            .connect()
            .then(function () {
            //6. let strm = stream.Writable;
            var request = new mssql.Request(dbConn);
            var data = [];
            var i = 1;
            request
                .query(SQL)
                .then(function (data) {
                //res.send(200,JSON.stringify(recordSet));
                console.log(data);
                var retObject = {};
                retObject.errCode = "0";
                retObject.errDesc = "";
                retObject.data = data.recordsets;
                retObject.returnValue = data.returnValue;
                retObject.output = {};
                dbConn.close();
                return data.recordsets[0];
                //res
                //    .status(200)
                //    .send(JSON.stringify(retObject));
            })["catch"](function (err) {
                //8.
                console.log(err);
                dbConn.close();
            });
        })["catch"](function (err) {
            //9.
            console.log(err);
        });
    };
    Dbase.prototype.executeSQl = function (req, res, next) {
        /*
            let config = {
                server: '10.2.1.35',
                database: 'Galaxy_Development',
                user: 'rread',
                password: 'galaxy',
                port: 1433
            };
            */
        //4. console.log(req.body)
        var SQL = req.body.SQL;
        console.log(SQL);
        var headerSent = false;
        var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
        //5.
        dbConn
            .connect()
            .then(function () {
            //6. let strm = stream.Writable;
            var request = new mssql.Request(dbConn);
            var data = [];
            var i = 1;
            /*
                    request.stream = true; // You can set streaming differently for each request
                    //request.query("select distinct gs_pr_name from ttodetail where gs_fy_yy= '2017' and isnull(gs_pr_name,'') <> ''"); // or request.execute(procedure);
                    request.query("select count(*) as 'count' from trptdata where gs_fy_yy = '2017' and " + SQL); // or request.execute(procedure);
    
    
                    request.on('recordset', function (columns) {
                        // Emitted once for each recordset in a query
    
                    });
    
                    request.on('row', function (row) {
                        // Emitted for each row in a recordset
                        res
                            .status(200)
                            .send(JSON.stringify(row));
                            //dbConn.close();
                    });
    
                    request.on('error', function (err) {
                        console.log(err);
                        // May be emitted multiple times
                    });
    
                    request.on('done', function (affected) {
                        // Always emitted as the last one console.log(data);
                        // res.write(JSON.stringify(data));
    
                        dbConn.close();
                    });
                    //7.
    
                    */
            request
                .query("select count(*) as 'count' from trptdata where gs_fy_yy = '2017' and " +
                SQL)
                .then(function (data) {
                //res.send(200,JSON.stringify(recordSet));
                console.log(data);
                var retObject = {};
                retObject.errCode = "0";
                retObject.errDesc = "";
                retObject.data = data.recordsets;
                retObject.returnValue = data.returnValue;
                retObject.output = {};
                dbConn.close();
                res.status(200).send(JSON.stringify(retObject));
            })["catch"](function (err) {
                //8.
                console.log(err);
                dbConn.close();
            });
        })["catch"](function (err) {
            //9.
            console.log(err);
        });
    };
    Dbase.prototype.loadEmployees = function (req, res, next) {
        /*
            let config = {
                server: '10.2.1.35',
                database: 'Galaxy_Development',
                user: 'rread',
                password: 'galaxy',
                port: 1433
            };
            */
        //4.
        var headerSent = false;
        var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
        //5.
        dbConn
            .connect()
            .then(function () {
            //6. let strm = stream.Writable;
            var request = new mssql.Request(dbConn);
            var data = [];
            var i = 1;
            request.stream = true; // You can set streaming differently for each request
            //request.query("select distinct gs_pr_name from ttodetail where gs_fy_yy= '2017' and isnull(gs_pr_name,'') <> ''"); // or request.execute(procedure);
            request.query("select distinct top 15000 gs_pr_name ,gs_ttl_i,gs_oru_i,gs_assign_fte,gs_assign_" +
                "eff_d,gs_bdgt_amt from ttodetail where gs_fy_yy= '2017' and isnull(gs_pr_name,''" +
                ") <> '' "); // or request.execute(procedure);
            /*
                // Simple writable stream that delays 1 sec before console.log and callback();
                // Purpose: test whether the pipe pauses correctly while waiting for write to finish
                var testStream = new stream.Writable({highWaterMark: 1, objectMode: true});
                testStream._write = function(chunk,encoding,callback) {
                    setTimeout(function() {
                        //console.log(chunk);
                        if(data.length < 2) {
                            data.push(JSON.stringify(chunk));
                        } else {
                        // res.write(JSON.stringify(data) + "(chunk " + i + ")\n");
                            console.log(data);
                            res.write(JSON.stringify(data));
                            //res.flush();
                            i = i + 1;
                            data = [];
                            data.push(JSON.stringify(chunk));
                            //res.write(JSON.stringify(row) + "(row) " + "\n");
                        }
                        //res.write(JSON.stringify(chunk));
                        callback();
                    },0);
                }
    
                // Pipe the query stream into the testStream
                request.pipe(testStream);
    
                testStream.on('row', function(data) {
                    console.log(data);
                });
    
                testStream.on('error', function(err) {
                    // ...
                    console.log(err);
                });
                testStream.on('finish', function() {
                    // ...
                    console.log('finish');
                    res.write(JSON.stringify(data));
                    res.end();
                    dbConn.close();
                });
                */
            /*
                strm._write = function (chunk, enc, next) {
                    console.dir(chunk);
                    next();
                };
    
                request.pipe(strm);
                stream.on('error', function(err) {
                    // ...
                });
                stream.on('finish', function() {
                    // ...
                });
                */
            request.on("recordset", function (columns) {
                // Emitted once for each recordset in a query
            });
            request.on("row", function (row) {
                // Emitted for each row in a recordset
                if (data.length < 1500) {
                    data.push(row);
                }
                else {
                    // res.write(JSON.stringify(data) + "(chunk " + i + ")\n"); console.log(data);
                    i = i + 1;
                    var dataJson = JSON.stringify(data);
                    data = [];
                    data.push(row);
                    //res.write(dataJson);
                    req.app.io.emit("message", dataJson);
                    /*
                            setTimeout(function() {
                                res.write(dataJson,"UTF8",next);
                                //res.write(JSON.stringify(row) + "(row) " + "\n");
                             },2000);
                             */
                }
            });
            request.on("error", function (err) {
                console.log(err);
                // May be emitted multiple times
            });
            request.on("done", function (affected) {
                // Always emitted as the last one console.log(data);
                // res.write(JSON.stringify(data));
                req.app.io.emit("message", JSON.stringify(data));
                res.status("200").send("Done");
                dbConn.close();
            });
            //7.
            /*
                request.query("select * from ttodetail where gs_fy_yy= '2017'").then(function (recordSet) {
                    res.send(200,JSON.stringify(recordSet));
                    console.log(recordSet);
                    dbConn.close();
                }).catch(function (err) {
                    //8.
                    console.log(err);
                    dbConn.close();
                });
                */
        })["catch"](function (err) {
            //9.
            console.log(err);
        });
    };
    Dbase.prototype.executeSP = function (req, res, next) {
        //2.
        //var dbConn = new mssql.Connection(config.get(env + ".dbConfig"));
        var spName = req.body.spName;
        var parms = JSON.parse(JSON.stringify(req.body.parms));
        // let parms = <Parms>JSON.parse(req.body.parms); let parms =
        // JSON.parse(req.body.parms);
        console.log(spName);
        console.log(parms);
        // let Parms :  any = req.body.parms.split("~!") var json = [{"parameter1",
        // "test", "parameter2": 3, "Parameter3": "test2"}];
        console.log(spName);
        var headerSent = false;
        var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
        var gs_start_tm = _getTimeStamp(); //func.getTimeStamp();//this._getTimeStamp;
        var errDesc = "";
        var gs_Err = "";
        var parm = "";
        var gs_end_tm = "";
        var request;
        dbConn
            .connect()
            .then(function () {
            //3.
            request = new mssql.Request(dbConn);
            //console.log(value)
            var keyArr = Object.keys(parms);
            console.log(keyArr);
            // loop through the object, pushing values to the return array
            keyArr.forEach(function (key) {
                console.log(key);
                parm += "'" + parms[key] + "',";
                request.input(key, parms[key]);
            });
            if (_.trim(parm) != "") {
                parm = parm.substr(0, parm.length - 1);
            }
            /*
                    for (var key in parms) {
                        console.log(parms[key])
                        request.input(key, parms[key]);
                    };
                    */
            request
                .execute(spName)
                .then(function (data) {
                //4.
                console.log(data);
                gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
                console.log(spName + " " + parm);
                console.log(gs_start_tm);
                console.log(gs_end_tm);
                console.log(errDesc);
                var retObject = {};
                retObject.errCode = "0";
                retObject.errDesc = "";
                retObject.data = data.recordsets;
                retObject.returnValue = data.returnValue;
                //console.log("output")
                retObject.output = data.output;
                //Log the database call
                request = new mssql.Request(dbConn);
                request.input("gs_user_i", "TestIDQA");
                request.input("gs_oru_i", "NA");
                request.input("gs_sql", spName + " " + parm);
                request.input("gs_strt_tm", gs_start_tm);
                request.input("gs_end_tm", gs_end_tm);
                request.input("gs_Err", gs_Err);
                request.input("gs_err_desc", errDesc);
                request.input("gs_web", "");
                request.input("gs_token", "");
                request.input("gs_object", "Node");
                request.input("gs_method", "executeSP");
                request.input("gs_transaction_id", "0");
                request
                    .execute("spi_tdblog_1")
                    .then(function (recordSet) {
                    //4.
                    console.log(recordSet);
                    dbConn.close();
                })["catch"](function (err) {
                    //5.
                    console.log(err);
                    dbConn.close();
                });
                console.log(retObject);
                res.status(200).send(JSON.stringify(retObject));
                //dbConn.close();
            })["catch"](function (err) {
                //5.
                gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
                console.log("Error Happened");
                console.log(err.code);
                //console.log(err.message) console.log(err)
                gs_Err = "-100";
                errDesc = err.message;
                console.log(errDesc);
                //Log the database call
                request = new mssql.Request(dbConn);
                request.input("gs_user_i", "TestIDQA");
                request.input("gs_oru_i", "NA");
                request.input("gs_sql", spName + " " + parm);
                request.input("gs_strt_tm", gs_start_tm);
                request.input("gs_end_tm", gs_end_tm);
                request.input("gs_Err", gs_Err);
                request.input("gs_err_desc", errDesc);
                request.input("gs_web", "");
                request.input("gs_token", "");
                request.input("gs_object", "Node");
                request.input("gs_method", "executeSP");
                request.input("gs_transaction_id", "0");
                request
                    .execute("spi_tdblog_1")
                    .then(function (recordSet) {
                    //4.
                    console.log(recordSet);
                    dbConn.close();
                })["catch"](function (err) {
                    //5.
                    console.log(err);
                    dbConn.close();
                });
                var errObject = {};
                errObject.errCode = "-100";
                errObject.errDesc = errDesc;
                res.status(200).send(JSON.stringify(errObject));
                //dbConn.close();
            });
        })["catch"](function (err) {
            //6.
            console.log(err);
        });
    };
    Dbase.prototype.insertRow = function (req, res, next) {
        //2.
        var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
        //3.
        dbConn
            .connect()
            .then(function () {
            //4.
            var transaction = new mssql.Transaction(dbConn);
            //5.
            transaction
                .begin()
                .then(function () {
                //6.
                var request = new mssql.Request(transaction);
                //7.
                request
                    .query("Insert into EmployeeInfo (EmpName,Salary,DeptName,Designation) values ('T.M. Sab" +
                    "nis',13000,'Accounts','Lead')")
                    .then(function () {
                    //8.
                    transaction
                        .commit()
                        .then(function (recordSet) {
                        console.log(recordSet);
                        dbConn.close();
                    })["catch"](function (err) {
                        //9.
                        console.log("Error in Transaction Commit " + err);
                        dbConn.close();
                    });
                })["catch"](function (err) {
                    //10.
                    console.log("Error in Transaction Begin " + err);
                    dbConn.close();
                });
            })["catch"](function (err) {
                //11.
                console.log(err);
                dbConn.close();
            });
        })["catch"](function (err) {
            //12.
            console.log(err);
        });
    };
    Dbase.prototype.get = function (req, res, next) {
        //let data = db.get(); res.send(200, { data });
        res.send(200, "Hello");
    };
    Dbase.prototype.getUser = function (req, res, next) {
        var userid = req.params.userid;
        var pwd = req.params.pwd;
        var con = mssql.createConnection({
            host: "127.0.0.1",
            database: "mygalaxy",
            user: "root",
            password: "",
            multipleStatements: true
        });
        /*
        var con = mssql.createConnection({
          host: "hvs.selfip.com",
          database: "HVS",
          user: "root",
          password: "galaxy",
          multipleStatements: true
          });
    */
        con.connect(function (err) {
            if (err) {
                console.log("Error connecting to Db");
                return;
            }
            console.log("Connection established");
        });
        con.query('SET @userid="' +
            userid +
            '"; set @pwd="' +
            pwd +
            '"; CALL sps_checkUser(@userid,@pwd)', function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send("Error " + err);
            }
            //if (err) throw err;
            res.status(200).send(JSON.stringify(rows[2]));
            console.log("Data received from Db:\n");
            console.log(rows);
        });
        con.end(function (err) {
            // The connection is terminated gracefully Ensures all previously enqueued
            // queries are still before sending a COM_QUIT packet to the MySQL server.
        });
        //res.send(200, db.get(id));
    };
    Dbase.prototype.addUser = function (req, res, next) {
        var userid = req.params.userid;
        var pwd = req.params.pwd;
        var fname = req.params.fname;
        var lname = req.params.lname;
        var age = req.params.age;
        var address = req.params.address;
        var con = mssql.createConnection({
            host: "127.0.0.1",
            database: "mygalaxy",
            user: "root",
            password: "welcome",
            multipleStatements: true
        });
        con.connect(function (err) {
            if (err) {
                console.log("Error connecting to Db");
                return;
            }
            console.log("Connection established");
        });
        con.query('SET @lname="' +
            lname +
            '"; SET @fname="' +
            fname +
            '"; SET @age="' +
            age +
            '"; SET @address="' +
            address +
            '"; set @userid="' +
            userid +
            '"; set @pwd="' +
            pwd +
            '"; CALL spi_tuser(@lname,@fname,@age,@address,@userid,@pwd)', function (err, rows, fields) {
            if (err) {
                console.log(err);
                res.status(500).send("Error " + err);
            }
            //if (err) throw err;
            res.status(200).send(JSON.stringify(rows[6]));
            console.log("Data received from Db:\n");
            console.log(rows);
        });
        con.end(function (err) {
            // The connection is terminated gracefully Ensures all previously enqueued
            // queries are still before sending a COM_QUIT packet to the MySQL server.
        });
        //res.send(200, db.get(id));
    };
    Dbase.prototype.getData = function (req, res, next) {
        var id = parseInt(req.params.id, 10);
        next();
        //res.send(200, "Hello" + +id); res.status(200).send( "Hello" + +id);
    };
    Dbase.prototype.sendData = function (req, res, next) {
        // First you need to create a connection to the db
        var con = mssql.createConnection({
            host: "127.0.0.1",
            database: "mygalaxy",
            user: "root",
            password: "welcome",
            multipleStatements: true
        });
        con.connect(function (err) {
            if (err) {
                console.log("Error connecting to Db");
                return;
            }
            console.log("Connection established");
        });
        con.query('SET @id="RR"; CALL sps_getUsers(@id)', function (err, rows) {
            if (err)
                throw err;
            res.status(200).send(JSON.stringify(rows[1]));
            console.log("Data received from Db:\n");
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
            // The connection is terminated gracefully Ensures all previously enqueued
            // queries are still before sending a COM_QUIT packet to the MySQL server.
        });
        // let id = parseInt(req.params.id,10); res.status(200).send("Hello sendData" +
        // +id); res.send(200, "Hello sendData" + +id);
    };
    return Dbase;
}(EventEmitter));
exports.Dbase = Dbase;
exports.DB = new Dbase();
exports.DBRouter = express_1.Router();
//DBRouter.post('/nycaps', DB.loadNycaps);
exports.DBRouter.post("/rules/executeSP", exports.DB.executeSP);
exports.DBRouter.post("/rules", exports.DB.executeSQl);
exports.DBRouter.post("/", exports.DB.loadEmployees);
/*
UsersRouter.post('/:userid/:pwd/:fname/:lname/:age/:address', DB.addUser);
UsersRouter.post('/:userid/:pwd', DB.getUser);
//UsersRouter.get('/test/:id', users.sendData);
UsersRouter.post('/test', DB.sendData);
//UsersRouter.get('/test/:id', [users.getData, users.sendData]);
*/
//# sourceMappingURL=mssql.js.map