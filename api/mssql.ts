import { Router, Request, Response, NextFunction } from "express";
import * as mssql from "mssql";
import * as stream from "stream";
import * as _ from "lodash";
import * as func from "./functions";
import * as config from "config";
import * as username from "username";
import * as os from "os";
import * as EventEmitter from "events";
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

let env = process.env.NODE_ENV || "Dev";
//let pool =  new mssql.connect(config.get(env + ".dbConfig"));

console.log("NODE_CONFIG_DIR: " + config.util.getEnv("NODE_CONFIG_DIR"));

mssql.on("error", err => {
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

const _getTimeStamp = () => {
  var now = new Date();
  return (
    now.getMonth() +
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
    (now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds())
  );
};

interface Parms {
  gs_name: any;
  gs_value: any;
}

export class Dbase extends EventEmitter {
  constructor() {
    super();
    console.log("Created"); // error here
  }

  /*
    _getTimeStamp = () => {
        var now = new Date();
            return ((now.getMonth() + 1) + '/' + (now.getDate()) + '/' + now.getFullYear() + " " + now.getHours() + ':'
                            + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now
                            .getSeconds()) : (now.getSeconds())));
    };
    */

  async execSP(sqlProc: string, parms: any) {
    //4.
    let headerSent: boolean = false;
    let gs_start_tm = _getTimeStamp(); //func.getTimeStamp();//this._getTimeStamp;
    let errDesc: string = "";
    let gs_Err: string = "";
    let parm: string = "";
    let gs_end_tm: string = "";

    // this.emit('error', new Error('whoops!')); var dbConn = new
    // mssql.Connection(config.get(env + ".dbConfig"));
    try {
      //mssql.close()
    } catch {}

    const pool = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    pool.on("error", err => {
      console.log("SQL errors", err);
    });

    //5. await dbConn.connect();
    let rolledBack = false;
    let result;
    let transaction;
    let req;

    try {
      await pool.connect();

      transaction = await new mssql.Transaction(pool);

      //transaction.begin(err =>  {
      await transaction.begin();
      //console.log("in transaction")

      result = await transaction
        .request()
        .input("gs_sp_name", sqlProc)
        .execute("sps_getSPParmNames");

      console.log(result);

      let hasOutput: boolean = false;
      let output_parm: any = "";

      req = await transaction.request();
      //req.multiple = true;

      //if (result[0].length > 0) {
      if (result.recordsets.length > 0) {
        let cnt = 0;
        result.recordset.forEach(val => {
          let rec = JSON.parse(JSON.stringify(val));
          // console.log(rec.ParameterName) console.log(rec.isOutput)
          // console.log(parms[cnt])
          if (_.trim(rec.isOutput) == "Y") {
            //console.log("in Out") console.log(rec.ParameterName)
            hasOutput = true;
            parm += rec.ParameterName + " output,";
            output_parm = rec.ParameterName;
            req.output(rec.ParameterName);
            //req.output("output_parameter");
          } else {
            if (!_.isUndefined(parms[cnt])) {
              parm += "'" + parms[cnt] + "',";
              req.input(rec.ParameterName, parms[cnt]);
            }
          }
          cnt += 1;
        });

        if (_.trim(parm) != "") {
          parm = parm.substr(0, parm.length - 1);
        }
      }

      console.log(sqlProc + " " + parm);
      let data = await req.execute(sqlProc);
      gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
      //console.log(data)

      /*                            
            if(sqlProc == "spi_teobj") {                     
                data = await req.execute(sqlProc)
            }                
            */

      let retObject: any = {};
      retObject.errCode = "0";
      retObject.errDesc = "";
      retObject.data = data.recordsets;
      retObject.returnValue = data.returnValue;
      //console.log("output")
      if (hasOutput) {
        retObject.output = data.output;
      } else {
        retObject.output = {};
      }

      //Log the database call
      req = await transaction.request();

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

      let tmpData = await req.execute("spi_tdblog_1");
      await transaction.commit();
      //console.log(data)
      //mssql.close()

      return JSON.stringify(retObject);
    } catch (err) {
      //9. console.log(err);
      await transaction.rollback(() => {
        console.log("%%%");
        //console.log(err)
      });

      //console.log(err.message);
      errDesc = err.message;
      gs_Err = "-100";
      gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
      //Log the database call
      req = await pool.request();

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

      let tmpData = await req.execute("spi_tdblog_1");

      let errObject: any = {};
      errObject.errCode = "-100";
      errObject.errDesc = errDesc;
      errObject.data = [];
      errObject.returnValue = "0";
      errObject.output = {};

      //mssql.close()
      return JSON.stringify(errObject);
    } finally {
      mssql.close();
      //pool.close(); //closing connection after request is finished.
    }
    /*
        try {
            let result = await pool
                .request()
                .input("gs_sp_name", sqlProc)
                .execute('sps_getSPParmNames');

            //console.log(result)
            let hasOutput : boolean = false;
            let output_parm : any = "";

            if (result[0].length > 0) {
                //request = new mssql.Request(dbConn);
                let req = await pool.request();
                req.multiple  =true;

                let cnt = 0;
                result[0].forEach((val) => {
                    let rec = JSON.parse(JSON.stringify(val));
                    //console.log(rec.ParameterName)
                    //console.log(rec.isOutput)
                    //console.log(parms[cnt])
                    if (_.trim(rec.isOutput) == "Y") {
                        //console.log("in Out")
                        //console.log(rec.ParameterName)
                        hasOutput = true;
                        parm += rec.ParameterName + " output,"
                        output_parm = rec.ParameterName;
                        req.output(rec.ParameterName);
                        //req.output("output_parameter");
                    } else {
                        if (!_.isUndefined(parms[cnt])) {
                            parm += "'" + parms[cnt] + "',"
                            req.input(rec.ParameterName, parms[cnt]);
                        }
                    }
                    cnt += 1;
                });

                if (_.trim(parm) != "") {
                    parm = parm.substr(0, parm.length - 1);
                }

                console.log(sqlProc + " " + parm);
                let data = await req.execute(sqlProc)
                gs_end_tm = _getTimeStamp(); //func.getTimeStamp();

                //console.log(req)
                //console.log(data)

                let retObject : any = {}
                retObject.errCode = "0"
                retObject.errDesc = "";
                retObject.data = data;
                retObject.returnValue = data.returnValue;
                if(hasOutput) {
                    retObject.output = req.parameters[output_parm].value;
                } else {
                    retObject.output = "0";
                }

                //Log the database call
                req = await pool.request();

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

                let tmpData = await req.execute("spi_tdblog_1")
                //console.log(data)

                return JSON.stringify(retObject);
            }
            //return JSON.stringify(data);
        } catch (err) {
            //9. console.log(err);
            console.log(err.message);
            errDesc = err.message;
            gs_Err = "-100"
            gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
            //Log the database call
            let req = await pool.request();

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

            let tmpData = await req.execute("spi_tdblog_1")

            let errObject : any = {}
            errObject.errCode = "-100"
            errObject.errDesc = errDesc;
            errObject.data = [];
            errObject.returnValue ="0";
            errObject.output ="0";

            return JSON.stringify(errObject);
        };
        */
  }

  async execSQl(sql: string) {
    //4. console.log(req.body) let SQL = req.body.SQL;
    console.log("execSQL");
    let SQL = sql;
    console.log(SQL);
    let headerSent: boolean = false;
    let gs_start_tm = _getTimeStamp(); //func.getTimeStamp();//this._getTimeStamp;
    let errDesc: string = "";
    let gs_Err: string = "";
    let parm: string = "";
    let gs_end_tm: string = "";
    let rolledBack = false;
    let transaction;

    const pool = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    pool.on("error", err => {
      console.log("SQL errors", err);
    });

    // 5. var dbConn = new mssql.Connection(config.get(env + ".dbConfig")); await
    // dbConn.connect()
    try {
      await pool.connect();
      //var request = new mssql.Request(dbConn);
      transaction = await new mssql.Transaction(pool);
      await transaction.begin();
      //console.log("in transaction")

      let res = await pool.request(transaction);
      //res.multiple = true;
      console.log(SQL);
      //winston.log('info', "Message.SQL=", SQL.replace(/'/g, ""));
      let data = await res.query(SQL);

      await transaction.commit();

      gs_end_tm = _getTimeStamp(); //func.getTimeStamp();
      let retObject: any = {};
      retObject.errCode = "0";
      retObject.errDesc = "";
      retObject.data = data.recordsets;
      retObject.returnValue = data.returnValue;
      retObject.output = {};

      //Log the database call
      res = await pool.request();

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

      let tmpData = await res.execute("spi_tdblog_1");
      //mssql.close()
      //console.log(data) let data = await request.query(SQL)
      return JSON.stringify(retObject);
    } catch (err) {
      //9. console.log(err);
      await transaction.rollback();

      errDesc = err.message;
      gs_Err = "-100";
      gs_end_tm = _getTimeStamp(); //func.getTimeStamp();

      let req = await pool.request();

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

      let tmpData = await req.execute("spi_tdblog_1");

      let errObject: any = {};
      errObject.errCode = "-100";
      errObject.errDesc = errDesc;
      errObject.data = [];
      errObject.returnValue = "0";
      errObject.output = {};

      //throw new Error("Error Occured");
      //mssql.close()
      return JSON.stringify(errObject);
    } finally {
      mssql.close();
      //pool.close(); //closing connection after request is finished.
    }
  }

  public eSQL(req: Request, res: Response, next?: Function) {
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
    let SQL = "select top 1 gs_document_name, gs_document from tleaveappdocs";
    console.log(SQL);
    let headerSent: boolean = false;
    var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    //5.
    dbConn
      .connect()
      .then(function() {
        //6. let strm = stream.Writable;
        var request = new mssql.Request(dbConn);
        let data: any[] = [];
        let i: number = 1;

        request
          .query(SQL)
          .then(function(data) {
            //res.send(200,JSON.stringify(recordSet));
            console.log(data);

            let retObject: any = {};
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
          })
          .catch(function(err) {
            //8.
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function(err) {
        //9.
        console.log(err);
      });
  }

  public executeSQl(req: Request, res: Response, next?: Function) {
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
    let SQL = req.body.SQL;
    console.log(SQL);
    let headerSent: boolean = false;
    var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    //5.
    dbConn
      .connect()
      .then(function() {
        //6. let strm = stream.Writable;
        var request = new mssql.Request(dbConn);
        let data: any[] = [];
        let i: number = 1;

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
          .query(
            "select count(*) as 'count' from trptdata where gs_fy_yy = '2017' and " +
              SQL
          )
          .then(function(data) {
            //res.send(200,JSON.stringify(recordSet));
            console.log(data);

            let retObject: any = {};
            retObject.errCode = "0";
            retObject.errDesc = "";
            retObject.data = data.recordsets;
            retObject.returnValue = data.returnValue;
            retObject.output = {};

            dbConn.close();
            res.status(200).send(JSON.stringify(retObject));
          })
          .catch(function(err) {
            //8.
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function(err) {
        //9.
        console.log(err);
      });
  }

  public loadEmployees(req: Request, res: Response, next?: Function) {
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
    let headerSent: boolean = false;
    var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    //5.
    dbConn
      .connect()
      .then(function() {
        //6. let strm = stream.Writable;
        var request = new mssql.Request(dbConn);
        let data: any[] = [];
        let i: number = 1;

        request.stream = true; // You can set streaming differently for each request
        //request.query("select distinct gs_pr_name from ttodetail where gs_fy_yy= '2017' and isnull(gs_pr_name,'') <> ''"); // or request.execute(procedure);
        request.query(
          "select distinct top 15000 gs_pr_name ,gs_ttl_i,gs_oru_i,gs_assign_fte,gs_assign_" +
            "eff_d,gs_bdgt_amt from ttodetail where gs_fy_yy= '2017' and isnull(gs_pr_name,''" +
            ") <> '' "
        ); // or request.execute(procedure);

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

        request.on("recordset", function(columns) {
          // Emitted once for each recordset in a query
        });

        request.on("row", function(row) {
          // Emitted for each row in a recordset
          if (data.length < 1500) {
            data.push(row);
          } else {
            // res.write(JSON.stringify(data) + "(chunk " + i + ")\n"); console.log(data);
            i = i + 1;
            let dataJson = JSON.stringify(data);
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

        request.on("error", function(err) {
          console.log(err);
          // May be emitted multiple times
        });

        request.on("done", function(affected) {
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
      })
      .catch(function(err) {
        //9.
        console.log(err);
      });
  }

  public executeSP(req: Request, res: Response, next?: Function) {
    //2.
    //var dbConn = new mssql.Connection(config.get(env + ".dbConfig"));
    let spName = req.body.spName;
    let parms = JSON.parse(JSON.stringify(req.body.parms));
    // let parms = <Parms>JSON.parse(req.body.parms); let parms =
    // JSON.parse(req.body.parms);
    console.log(spName);
    console.log(parms);
    // let Parms :  any = req.body.parms.split("~!") var json = [{"parameter1",
    // "test", "parameter2": 3, "Parameter3": "test2"}];

    console.log(spName);

    let headerSent: boolean = false;
    var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    let gs_start_tm = _getTimeStamp(); //func.getTimeStamp();//this._getTimeStamp;
    let errDesc: string = "";
    let gs_Err: string = "";
    let parm: string = "";
    let gs_end_tm: string = "";
    var request;

    dbConn
      .connect()
      .then(function() {
        //3.
        request = new mssql.Request(dbConn);

        //console.log(value)
        let keyArr: any[] = Object.keys(parms);
        console.log(keyArr);

        // loop through the object, pushing values to the return array

        keyArr.forEach((key: any) => {
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
          //.input('Salary', mssql.Int, 50000)
          .execute(spName)
          .then(function(data) {
            //4.
            console.log(data);

            gs_end_tm = _getTimeStamp(); //func.getTimeStamp();

            console.log(spName + " " + parm);
            console.log(gs_start_tm);
            console.log(gs_end_tm);
            console.log(errDesc);

            let retObject: any = {};
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
              //.input('Salary', mssql.Int, 50000)
              .execute("spi_tdblog_1")
              .then(function(recordSet) {
                //4.
                console.log(recordSet);
                dbConn.close();
              })
              .catch(function(err) {
                //5.
                console.log(err);
                dbConn.close();
              });

            console.log(retObject);
            res.status(200).send(JSON.stringify(retObject));
            //dbConn.close();
          })
          .catch(function(err) {
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
              //.input('Salary', mssql.Int, 50000)
              .execute("spi_tdblog_1")
              .then(function(recordSet) {
                //4.
                console.log(recordSet);
                dbConn.close();
              })
              .catch(function(err) {
                //5.
                console.log(err);
                dbConn.close();
              });

            let errObject: any = {};
            errObject.errCode = "-100";
            errObject.errDesc = errDesc;

            res.status(200).send(JSON.stringify(errObject));
            //dbConn.close();
          });
      })
      .catch(function(err) {
        //6.
        console.log(err);
      });
  }

  public insertRow(req: Request, res: Response, next?: Function) {
    //2.
    var dbConn = new mssql.ConnectionPool(config.get(env + ".dbConfig"));
    //3.
    dbConn
      .connect()
      .then(function() {
        //4.
        var transaction = new mssql.Transaction(dbConn);
        //5.
        transaction
          .begin()
          .then(function() {
            //6.
            var request = new mssql.Request(transaction);
            //7.
            request
              .query(
                "Insert into EmployeeInfo (EmpName,Salary,DeptName,Designation) values ('T.M. Sab" +
                  "nis',13000,'Accounts','Lead')"
              )
              .then(function() {
                //8.
                transaction
                  .commit()
                  .then(function(recordSet) {
                    console.log(recordSet);
                    dbConn.close();
                  })
                  .catch(function(err) {
                    //9.
                    console.log("Error in Transaction Commit " + err);
                    dbConn.close();
                  });
              })
              .catch(function(err) {
                //10.
                console.log("Error in Transaction Begin " + err);
                dbConn.close();
              });
          })
          .catch(function(err) {
            //11.
            console.log(err);
            dbConn.close();
          });
      })
      .catch(function(err) {
        //12.
        console.log(err);
      });
  }

  public get(req: Request, res: Response, next?: NextFunction) {
    //let data = db.get(); res.send(200, { data });
    res.send(200, "Hello");
  }

  public getUser(req: Request, res: Response, next?: Function) {
    let userid = req.params.userid;
    let pwd = req.params.pwd;

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
    con.connect(function(err) {
      if (err) {
        console.log("Error connecting to Db");
        return;
      }
      console.log("Connection established");
    });

    con.query(
      'SET @userid="' +
        userid +
        '"; set @pwd="' +
        pwd +
        '"; CALL sps_checkUser(@userid,@pwd)',
      function(err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Error " + err);
        }
        //if (err) throw err;
        res.status(200).send(JSON.stringify(rows[2]));
        console.log("Data received from Db:\n");
        console.log(rows);
      }
    );

    con.end(function(err) {
      // The connection is terminated gracefully Ensures all previously enqueued
      // queries are still before sending a COM_QUIT packet to the MySQL server.
    });
    //res.send(200, db.get(id));
  }

  public addUser(req: Request, res: Response, next?: Function) {
    let userid = req.params.userid;
    let pwd = req.params.pwd;
    let fname = req.params.fname;
    let lname = req.params.lname;
    let age = req.params.age;
    let address = req.params.address;

    var con = mssql.createConnection({
      host: "127.0.0.1",
      database: "mygalaxy",
      user: "root",
      password: "welcome",
      multipleStatements: true
    });

    con.connect(function(err) {
      if (err) {
        console.log("Error connecting to Db");
        return;
      }
      console.log("Connection established");
    });

    con.query(
      'SET @lname="' +
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
        '"; CALL spi_tuser(@lname,@fname,@age,@address,@userid,@pwd)',
      function(err, rows, fields) {
        if (err) {
          console.log(err);
          res.status(500).send("Error " + err);
        }
        //if (err) throw err;
        res.status(200).send(JSON.stringify(rows[6]));
        console.log("Data received from Db:\n");
        console.log(rows);
      }
    );

    con.end(function(err) {
      // The connection is terminated gracefully Ensures all previously enqueued
      // queries are still before sending a COM_QUIT packet to the MySQL server.
    });
    //res.send(200, db.get(id));
  }

  public getData(req: Request, res: Response, next?: Function) {
    let id = parseInt(req.params.id, 10);
    next();
    //res.send(200, "Hello" + +id); res.status(200).send( "Hello" + +id);
  }

  public sendData(req: Request, res: Response, next?: Function) {
    // First you need to create a connection to the db
    var con = mssql.createConnection({
      host: "127.0.0.1",
      database: "mygalaxy",
      user: "root",
      password: "welcome",
      multipleStatements: true
    });

    con.connect(function(err) {
      if (err) {
        console.log("Error connecting to Db");
        return;
      }
      console.log("Connection established");
    });

    con.query('SET @id="RR"; CALL sps_getUsers(@id)', function(err, rows) {
      if (err) throw err;

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

    con.end(function(err) {
      // The connection is terminated gracefully Ensures all previously enqueued
      // queries are still before sending a COM_QUIT packet to the MySQL server.
    });

    // let id = parseInt(req.params.id,10); res.status(200).send("Hello sendData" +
    // +id); res.send(200, "Hello sendData" + +id);
  }
}

export const DB = new Dbase();
export const DBRouter = Router();

//DBRouter.post('/nycaps', DB.loadNycaps);
DBRouter.post("/rules/executeSP", DB.executeSP);
DBRouter.post("/rules", DB.executeSQl);
DBRouter.post("/", DB.loadEmployees);

/*
UsersRouter.post('/:userid/:pwd/:fname/:lname/:age/:address', DB.addUser);
UsersRouter.post('/:userid/:pwd', DB.getUser);
//UsersRouter.get('/test/:id', users.sendData);
UsersRouter.post('/test', DB.sendData);
//UsersRouter.get('/test/:id', [users.getData, users.sendData]);
*/
