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
var http = require('http');
var https = require('https');
const privateKey = fs.readFileSync('/etc/letsencrypt/live/agrolinks.lk/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/agrolinks.lk/cert.pem', 'utf8');
const credentials = {
	key: privateKey,
	cert: certificate,
};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

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
  database:'agrodb'
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
            var active = element.Active; 
            var userrole = element.UserRole; 
            var token = 'basic' + ' ' + btoa(element.Username + ':' + element.Password)
            user.push({Id: id, Name: name, Username: username, Active: active, UserRole: userrole, Token: token})
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

//#region categories
app.post("/category/savecategory", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const category = req.body;
      if(category.Id == undefined || category.Id == null || category.Id == ""){
        category.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO category SET ?', category, (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }else{
        con.query('UPDATE category SET Title = ?, Icon = ?,Description = ?, DatePublished = ? Where Id = ?',
        [category.Title,category.Icon,category.Description,category.DatePublished,category.Id], (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }
    }
  });
});

app.post("/category/getcategories", (req, res, next) => {
  const limit = JSON.parse(req.body);
  con.query('SELECT * FROM category ORDER BY DatePublished DESC LIMIT ?,?', [parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/category/getcategorydata", (req, res, next) => {
  const category = req.body;
  con.query('SELECT * FROM category WHERE Id = ?', category.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/category/deletecategory", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const category = req.body;
      con.query('SELECT * FROM category WHERE Id = ?', category.Id.toString(), function(err, rows, fields) {
        if(err) throw err;
        var count = rows.length;
        if (count) {
          con.query('SELECT * FROM product WHERE CategoryId = ?', category.Id.toString(), function(err, rows, fields) {
            if(err) throw err;
            var productcount = rows.length;
            if (productcount == 0) {
              con.query('DELETE FROM category WHERE Id = ?', category.Id.toString(), function(err, row, fields) {
                if(err) throw err;
                res.json("");
              });
            }else{
              res.json("Cannot delete");
            }
          });
        } 
      });
    }
  });
});
//#endregion

//#region products
app.post("/product/saveproduct", (req, res, next) => {
    //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const product = req.body;
      if(product.Id == undefined || product.Id == null || product.Id == ""){
        product.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO product SET ?', product, (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }else{
        con.query('UPDATE product SET CategoryId = ?, Title = ?,Image = ?,Price = ?, Weight = ?,Description = ?, DatePublished = ? Where Id = ?',
        [product.CategoryId,product.Title,product.Image,parseFloat(product.Price),parseInt(product.Weight),product.Description, product.DatePublished,product.Id], (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }
    }
  });
});

app.post("/product/getproducts", (req, res, next) => {
  const limit = JSON.parse(req.body);
  con.query('SELECT * FROM product ORDER BY DatePublished DESC LIMIT ?,?', [parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/getproductoncategory", (req, res, next) => {
  const category = req.body;
  con.query('SELECT * FROM product WHERE CategoryId = ? ORDER BY DatePublished DESC', category.Id, (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/searchproducts", (req, res, next) => {
  const limit = JSON.parse(req.body);
  con.query('SELECT * FROM product WHERE Title LIKE ? ORDER BY DatePublished DESC LIMIT ?,?', ['%' + limit.searchkey + '%',parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/getproductscount", (req, res, next) => {
  const category = req.body;
  console.log(category.Id )
  con.query('SELECT COUNT(Id) AS ProductCount FROM product WHERE CategoryId = ? GROUP BY CategoryId', category.Id, (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/getallproductscount", (req, res, next) => {
  con.query('SELECT COUNT(Id) AS ProductCount FROM product', (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/getproductdata", (req, res, next) => {
  const product = req.body;
  con.query('SELECT * FROM product WHERE Id = ?', product.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/deleteproduct", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const product = req.body;
      con.query('SELECT * FROM product WHERE Id = ?', product.Id.toString(), function(err, rows, fields) {
        if(err) throw err;
        var count = rows.length;
        if (count) {
          con.query('DELETE FROM product WHERE Id = ?', product.Id.toString(), function(err, row, fields) {
            if(err) throw err;
            res.json("");
          });
        } 
      });
    }
  });
});
//#endregion

//#region orders
app.post("/order/saveorder", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  UserAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const order = req.body;
      console.log(order)
      if(order.Id == undefined || order.Id == null || order.Id == ""){
        order.Id = Math.random().toString(7).slice(2);
        con.query('INSERT INTO productorder(Id,IdForCustomer,UserEmail,DeliveryNote,Phone,RecepientName,RecepientPhone,Status,DateofPayment,City,TotalAmount) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
        [order.Id,order.IdForCustomer,order.UserEmail,order.DeliveryNote,order.Phone,order.RecepientName,order.RecepientPhone,order.Status,order.DateofPayment,order.City,order.TotalAmount], (err, row) => {
          if(err) 
          {
            console.log(err)
            throw err;
          }
          res.json("")
        });
        order.OrderedProducts.forEach(element => {
          element.Id = Math.random().toString(7).slice(2);
          con.query('INSERT INTO orderedproduct SET ?', element, (err, row) => {
            if(err) throw err;
            res.json("")
          });
        });
      }else{
        con.query('UPDATE order SET Status = ? WHERE Id = ?',[order.Status,order.Id], (err, row) => {
          if(err) throw err;
          res.json("")
        });
      }
    }
  });
});

app.post("/order/getorders", (req, res, next) => {
  //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const limit = JSON.parse(req.body);
      con.query('SELECT * FROM productorder ORDER BY DateOfPayment DESC LIMIT ?,?', [parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
        if(err) throw err;
        res.json(rows);
      });
    }
  });
});

app.post("/order/getorderdata", (req, res, next) => {
    //check the permission to allow the method
    var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
    var username = usrpwd.split(":")[0]
    var password = usrpwd.split(":")[1]
    var credentials = {Username: username,Password: password};
  
    AdminAuthPermission(credentials, function(err, count) {
      if(count == 1){
        const order = req.body;
        con.query('SELECT * FROM productorder WHERE Id = ?', order.Id.toString(), (err, rows) => {
          if(err) throw err;
          res.json(rows);
        });
      }
    });
});

app.post("/order/deleteorder", (req, res, next) => {
    //check the permission to allow the method
  var usrpwd = atob(req.headers.authorization.split("basic")[1].trim())
  var username = usrpwd.split(":")[0]
  var password = usrpwd.split(":")[1]
  var credentials = {Username: username,Password: password};

  AdminAuthPermission(credentials, function(err, count) {
    if(count == 1){
      const order = req.body;
      con.query('SELECT * FROM productorder WHERE Id = ?', order.Id.toString(), function(err, rows, fields) {
        if(err) throw err;
        var count = rows.length;
        if (count) {
          con.query('DELETE FROM productorder WHERE Id = ?', order.Id.toString(), function(err, row, fields) {
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

// app.listen(3000, () => {
//   console.log('Server started!')
// });

httpServer.listen(3001, (err) => {
  if(err){
    console.log(err)
  }
  console.log('http server started!')
});

httpsServer.listen(3000, () => {
  console.log('https server started!')
});

