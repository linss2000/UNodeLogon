import { Router, Request, Response, NextFunction } from 'express';
import { MockDB, MOCK_USERS, User } from './mockdb';
import * as mysql from "mysql";
//import * as async from "async";

const db = new MockDB<User>(MOCK_USERS);
 
export class Users {
   public get(req: Request, res: Response, next?: NextFunction) {
    let data = db.get();
    res.send(200, { data });
  }
 
  public getUser(req: Request, res: Response, next?: Function) {
    let userid = req.params.userid;
    let pwd = req.params.pwd;

    var con = mysql.createConnection({
      host: "127.0.0.1",
      database: "HVS",
      user: "root",
      password: "galaxy",
      multipleStatements: true
      });

      con.connect(function(err){
        if(err){
          console.log('Error connecting to Db');
          return;
        }
        console.log('Connection established');
      });


      con.query('SET @userid="' + userid + '"; set @pwd="' + pwd + '"; CALL sps_checkUser(@userid,@pwd)',
        function(err,rows,fields){

        if(err){
          console.log(err);
          res.status(500).send("Error " + err);
        }
        //if (err) throw err;
        res.status(200).send(JSON.stringify(rows[2]));
        console.log('Data received from Db:\n');
        console.log(rows);
      });

     con.end(function(err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
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

    var con = mysql.createConnection({
      host: "localhost",
      database: "mygalaxy",
      user: "root",
      password: "welcome",
      multipleStatements: true
      });

      con.connect(function(err){
        if(err){
          console.log('Error connecting to Db');
          return;
        }
        console.log('Connection established');
      });


      con.query('SET @lname="' + lname + '"; SET @fname="' + fname + '"; SET @age="' + age + '"; SET @address="' + address + '"; set @userid="' + userid + '"; set @pwd="' + pwd + '"; CALL spi_tuser(@lname,@fname,@age,@address,@userid,@pwd)',
        function(err,rows,fields){

        if(err){
          console.log(err);
          res.status(500).send("Error " + err);
        }
        //if (err) throw err;
        res.status(200).send(JSON.stringify(rows[6]));
        console.log('Data received from Db:\n');
        console.log(rows);
      });

     con.end(function(err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
      });
    //res.send(200, db.get(id));
  }

  public getData(req:Request, res: Response, next?: Function) {
    let id = parseInt(req.params.id,10);
    next();
    //res.send(200, "Hello" + +id);
    //res.status(200).send( "Hello" + +id);

  }

  public sendData(req:Request, res: Response, next?: Function){   
    // First you need to create a connection to the db
    var con = mysql.createConnection({
      host: "localhost",
      database: "mygalaxy",
      user: "root",
      password: "welcome",
      multipleStatements: true
      });

    con.connect(function(err){
      if(err){
        console.log('Error connecting to Db');
        return;
      }
        console.log('Connection established');
      });


      con.query('SET @id="RR"; CALL sps_getUsers(@id)',function(err,rows){
        if (err) throw err;

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

      con.end(function(err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
      });

      //let id = parseInt(req.params.id,10);
      //res.status(200).send("Hello sendData" + +id);
      //res.send(200, "Hello sendData" + +id);
  }
}
 
const users = new Users();
 
export const UsersRouter = Router();
UsersRouter.get('/', users.get);
UsersRouter.post('/:userid/:pwd/:fname/:lname/:age/:address', users.addUser);
UsersRouter.post('/:userid/:pwd', users.getUser);
//UsersRouter.get('/test/:id', users.sendData);
UsersRouter.post('/test', users.sendData);
//UsersRouter.get('/test/:id', [users.getData, users.sendData]);
