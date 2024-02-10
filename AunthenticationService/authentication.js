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


//#region authenticate
app.post("/auth/authenticate", (req, res, next) => {
  const credentials = req.body;
  var user = AuthenticateUser(credentials,res);
  user;
});

function AuthenticateUser(credentials,res){
  var user = [];
  con.query('SELECT * FROM systemuser WHERE Username = ?', credentials.Username, function(err, rows, fields) {
    if(err) throw err;
    var count1 = rows.length;
    if (count1) {
      con.query('SELECT * FROM systemuser WHERE Username = ? AND Password = ?', [credentials.Username,credentials.Password], function(error, rows2, fields) {
        if(error) throw error;
        var count2 = rows2.length;
        if (count2) {
          rows2.forEach(function(element, index) {
            var id = element.Id; 
            var name = element.Name; 
            var username = element.Username; 
            var phone = element.Phone; 
            var active = element.Active; 
            var userrole = element.UserRole; 
            var roaming = element.Roaming; 
            var ringingtone = element.RingingTone; 
            var work = element.WorkPackage; 
            var student = element.StudentPackage; 
            var workstudent = element.WorkStudentPackage; 
            var family = element.FamilyPackage; 
            var familyplus = element.FamilyPlusPackage; 

            var token = 'basic' + ' ' + btoa(element.Username + ':' + element.Password)
            user.push({Id: id, Name: name, Username: username, Phone: phone, Active: active, UserRole: userrole,
              Roaming: roaming, RingingTone: ringingtone, WorkPackage: work, 
              StudentPackage: student, WorkStudentPackage: workstudent, 
              FamilyPackage: family, FamilyPlusPackage: familyplus, Token: token})
          });
          res.json(user);
        } else{
          user.push({Username: credentials.Username,Password: "invalid"});
          res.json(user);
        }
      });
    }else{
      user.push({Username: "usernotexists",Password: ""});
      res.json(user);
    }
  });
  return res;
};

function AdminAuthPermission(credentials, callback) {
  con.query('SELECT * FROM systemuser WHERE Username = ? AND Password = ? AND UserRole = ?', [credentials.Username,credentials.Password,"admin"], function(error, rows, fields) {
      if (error) {
          callback(error, null);
      } else 
          callback(null, rows.length);
  });
}

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
    con.query('UPDATE systemuser SET Name = ?, Username = ?, Phone = ?, Password = ?, Active = ?, UserRole = ? Where Id = ?',
    [user.Name,user.Username, user.Phone, user.Password,user.Active,"user",user.Id], (err, row) => {
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

  UserAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const user = req.body;
      if(user.Id == undefined || user.Id == null || user.Id == ""){
        user.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO systemuser SET ?', user, (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }else{
        con.query('UPDATE systemuser SET Name = ?, Username = ?, Phone = ?, Password = ?, Active = ?, UserRole = ? Where Id = ?',
        [user.Name, user.Username, user.Phone, user.Password,user.Active,user.UserRole,user.Id], (err, row) => {
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
//#endregion

//#region banners
app.post("/banner/savebanner", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const banner = req.body;
      if(banner.Id == undefined || banner.Id == null || banner.Id == ""){
        banner.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO banner SET ?', banner, (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }else{
        con.query('UPDATE banner SET Title = ?,Image = ?, Description = ?, DatePublished = ? Where Id = ?',
        [banner.Title,banner.Image,banner.Description, banner.DatePublished,banner.Id], (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }
    } else{
      res.status(401)
    }
  });

});

app.post("/banner/getbanners", (req, res, next) => {
  const limit = JSON.parse(req.body);
  con.query('SELECT * FROM banner ORDER BY DatePublished DESC LIMIT ?,?', [parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/banner/getbannerdata", (req, res, next) => {
  const banner = req.body;
  con.query('SELECT * FROM banner WHERE Id = ?', banner.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/banner/deletebanner", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const banner = req.body;
      con.query('SELECT * FROM banner WHERE Id = ?', banner.Id.toString(), function(err, rows, fields) {
        if(err) throw err;
        var count = rows.length;
        if (count) {
          con.query('DELETE FROM banner WHERE Id = ?', banner.Id.toString(), function(err, row, fields) {
            if(err) throw err;
            res.json("");
          });
        } 
      });
    }
  });
});
//#endregion

//#region contactus
app.post("/contactus/savemessage", (req, res, next) => {
  const contactusmessage = req.body;
  if(contactusmessage.Id == undefined || contactusmessage.Id == null || contactusmessage.Id == ""){
    contactusmessage.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO category SET ?', category, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }
});
//#endregion

app.listen(2000, () => {
  console.log('Server started at Port 2000!')
});


