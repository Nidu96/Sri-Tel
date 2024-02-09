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

//#region user
app.post("/user/register", (req, res, next) => {
  const user = req.body;
  if(user.Id == undefined || user.Id == null || user.Id == ""){
    user.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO systemuser SET ?', user, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE systemuser SET Name = ?, Username = ?, Password = ?, Active = ?, UserRole = ? Where Id = ?',
    [user.Name,user.Username, user.Password,user.Active,"user",user.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }
});

app.post("/user/saveuser", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const user = req.body;
      if(user.Id == undefined || user.Id == null || user.Id == ""){
        user.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO systemuser SET ?', user, (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }else{
        con.query('UPDATE systemuser SET Name = ?, Username = ?, Password = ?, Active = ?, UserRole = ? Where Id = ?',
        [user.Name,user.Username, user.Password,user.Active,user.UserRole,user.Id], (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }
    }
  });
});


app.post("/user/checkuserexist", (req, res, next) => {
  const credentials = req.body;
  con.query('SELECT * FROM systemuser WHERE Username = ?', credentials.Username, function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) {
      res.json(true);
    }else{
      res.json(false);
    }
  });
});


app.post("/user/getusers", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      let users = []
      const limit = JSON.parse(req.body);
      con.query('SELECT * FROM systemuser LIMIT ?,?', [parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
        if(err) throw err;
        res.json(rows);
        var count = rows.length;
        if (count) {
          rows.forEach(function(element, index) {
            var id = element.Id; 
            var name = element.Name; 
            var username = element.Username; 
            var active = element.Active; 
            var userrole = element.UserRole; 

            // con.query('SELECT * FROM Permissions WHERE UserId = ?', id, function(err, permissions, fields) {
            //   if(err) throw err;
            //   users.push({Id: id, Name: name, Username: username,
            //     Active: active, UserRole: userrole,
            //     PermissionsList: JSON.parse(JSON.stringify(permissions))});


            //   if (index === rows.length - 1) {
            //     res.json(users);
            //   }
            // });
            
          });
        }
      });
    }
  });
});


app.post("/user/getuserdata", (req, res, next) => {
  const user = req.body;
  con.query('SELECT * FROM systemuser WHERE Id = ?', user.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/user/deleteuser", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const user = req.body;
      con.query('SELECT * FROM systemuser WHERE Id = ?', user.Id.toString(), function(err, rows, fields) {
        if(err) throw err;
        var count = rows.length;
        if (count) { 
          con.query('DELETE FROM systemuser WHERE Id = ?', user.Id.toString(), function(err, row, fields) {
            if(err) throw err;
            res.json("");
          });
        } 
      });
    }
  });
});

app.post("/user/deletepermissions", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const permissionlist = req.body;
      permissionlist.forEach(element => {
        con.query('SELECT * FROM permissions WHERE Id = ?', element.Id.toString(), function(err, rows, fields) {
          if(err) throw err;
          var count = rows.length;
          if (count) {
            var id = rows.map(i => i.Id); 
            con.query('DELETE FROM permissions WHERE Id = ?', element.Id.toString(), function(err, row, fields) {
              if(err) throw err;
              res.json("");
            });
          } 
        });
      });
    }
  });
});
//#endregion


app.listen(3000, () => {
  console.log('Server started at Port 3000!')
});


