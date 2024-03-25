const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const formidable = require('formidable');
const fs = require('fs');
const atob = require('atob');
const btoa = require('btoa');

app.use(methodOverride('_method'));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
app.use(bodyParser.text({ limit: '200mb' }));
app.use(cors());



app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
  });

const con = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'sriteldb'
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


//#region validate user
function UserAuthPermission(credentials, callback) {
  con.query('SELECT * FROM systemuser WHERE Username = ? AND Password = ? AND UserRole = ?', [credentials.Username,credentials.Password,"user"], function(error, rows, fields) {
      if (error) {
          callback(error, null);
      } else 
          callback(null, rows.length);
  });
}
//#endregion

//#region payment
app.post("/bills/savebill", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  UserAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const bill = req.body;
      if(bill.Id == undefined || bill.Id == null || bill.Id == ""){
        bill.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO bills SET ?', bill, (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }
    } else{
      res.status(401)
    }
  });

});

app.post("/bills/getbills", (req, res, next) => {
    //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  UserAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const userId = req.body;
      con.query('SELECT * FROM bills WHERE UserId = ? ORDER BY DatePublished DESC', userId, (err,rows) => {
        if(err) throw err;
        res.json(rows);
      });
    } else{
      res.status(401)
    }
  });
});

//#endregion


app.listen(3000, () => {
  console.log('Server started at Port 3000!')
});


