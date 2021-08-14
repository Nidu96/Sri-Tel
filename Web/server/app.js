const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const formidable = require('formidable');

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
  con.query('SELECT * FROM SystemUser WHERE Username = ?', credentials.Username, function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    res.json(rows);
    // if (count) {
    //   con.query('SELECT * FROM SystemUser WHERE Username = ? AND Password = ?', [credentials.Username,credentials.Password], function(err, rows, fields) {
    //     if(err) throw err;
    //     var count = rows.length;
    //     if (count) {
    //       var id = rows.map(i => i.Id); 
    //       var name = rows.map(i => i.Name); 
    //       var username = rows.map(i => i.Username); 
    //       var active = rows.map(i => i.Active); 
    //       var userrole = rows.map(i => i.UserRole); 
    //       con.query('SELECT * FROM Permissions WHERE UserId = ?', id, function(err, permissions, fields) {
    //         if(err) throw err;
    //         var user = [];
    //         user.push({Id: id[0], Name: name[0], Username: username[0],
    //           Active: active[0], UserRole: userrole[0],
    //           PermissionsList: JSON.parse(JSON.stringify(permissions))})
    //         res.json(user);
    //       });

    //     } else{
    //       var user = [];
    //       user.push({Username: credentials.Username,Password: "invalid"})
    //       res.json(user);
    //     }
    //   });
    // }else{
    //   var user = [];
    //   user.push({Username: "usernotexists",Password: ""})
    //   res.json(user);
    // }
  });
});
//#endregion

//#region user
app.post("/user/saveuser", (req, res, next) => {
  const user = req.body;
  if(user.Id == undefined || user.Id == null || user.Id == ""){
    user.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO SystemUser SET ?', user, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE SystemUser SET name = ?, username = ?, password = ?, active = ?, userrole = ? Where id = ?',
    [user.Name,user.Username, user.Password,user.Active,user.UserRole,user.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }
});


app.post("/user/checkuserexist", (req, res, next) => {
  const credentials = req.body;
  con.query('SELECT * FROM SystemUser WHERE Username = ?', credentials.Username, function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) {
      res.json(true);
    }else{
      res.json(false);
    }
  });
});


app.get("/user/getusers", (req, res, next) => {
  let users = []
  con.query('SELECT * FROM SystemUser', (err,rows) => {
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
});


app.post("/user/getuserdata", (req, res, next) => {
  const user = req.body;
  con.query('SELECT * FROM SystemUser WHERE Id = ?', user.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/user/deleteuser", (req, res, next) => {
  const user = req.body;
  con.query('SELECT * FROM SystemUser WHERE Id = ?', user.Id.toString(), function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) { 
      con.query('DELETE FROM SystemUser WHERE Id = ?', user.Id.toString(), function(err, row, fields) {
        if(err) throw err;
        res.json("");
      });
    } 
  });
});

app.post("/user/deletepermissions", (req, res, next) => {
  const permissionlist = req.body;
  permissionlist.forEach(element => {
    con.query('SELECT * FROM Permissions WHERE Id = ?', element.Id.toString(), function(err, rows, fields) {
      if(err) throw err;
      var count = rows.length;
      if (count) {
        var id = rows.map(i => i.Id); 
        con.query('DELETE FROM Permissions WHERE Id = ?', element.Id.toString(), function(err, row, fields) {
          if(err) throw err;
          res.json("");
        });
      } 
    });
  });

});
//#endregion

//#region banners
app.post("/banner/savebanner", (req, res, next) => {
  const banner = req.body;
  if(banner.Id == undefined || banner.Id == null || banner.Id == ""){
    banner.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO Banner SET ?', banner, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE Banner SET title = ?,image = ?, description = ?, datepublished = ? Where id = ?',
    [banner.Title,banner.Image,banner.Description, banner.DatePublished,banner.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

});

app.get("/banner/getbanners", (req, res, next) => {
  con.query('SELECT * FROM Banner ORDER BY DatePublished DESC', (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/banner/getbannerdata", (req, res, next) => {
  const banner = req.body;
  con.query('SELECT * FROM Banner WHERE Id = ?', banner.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/banner/deletebanner", (req, res, next) => {
  const banner = req.body;
  con.query('SELECT * FROM Banner WHERE Id = ?', banner.Id.toString(), function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) {
      con.query('DELETE FROM Banner WHERE Id = ?', banner.Id.toString(), function(err, row, fields) {
        if(err) throw err;
        res.json("");
      });
    } 
  });
});
//#endregion

//#region categories
app.post("/category/savecategory", (req, res, next) => {
  const category = req.body;
  if(category.Id == undefined || category.Id == null || category.Id == ""){
    category.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO Category SET ?', category, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE Category SET title = ?,image = ?, description = ?, datepublished = ? Where id = ?',
    [category.Title,category.Image,category.Description, category.DatePublished,category.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

});

app.get("/category/getcategories", (req, res, next) => {
  con.query('SELECT * FROM Category ORDER BY DatePublished DESC', (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/category/getcategorydata", (req, res, next) => {
  const category = req.body;
  con.query('SELECT * FROM Category WHERE Id = ?', category.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/category/deletecategory", (req, res, next) => {
  const category = req.body;
  con.query('SELECT * FROM Category WHERE Id = ?', category.Id.toString(), function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) {
      con.query('DELETE FROM Category WHERE Id = ?', category.Id.toString(), function(err, row, fields) {
        if(err) throw err;
        res.json("");
      });
    } 
  });
});
//#endregion

//#region products
app.post("/product/saveproduct", (req, res, next) => {
  const product = req.body;
  if(product.Id == undefined || product.Id == null || product.Id == ""){
    product.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO Product SET ?', product, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE Product SET title = ?,image = ?,price = ?, category = ?,description = ?, datepublished = ? Where id = ?',
    [product.Title,product.Image,product.Price,product.Category,product.Description, product.DatePublished,product.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

});

app.get("/product/getproducts", (req, res, next) => {
  con.query('SELECT * FROM Product ORDER BY DatePublished DESC', (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/getproductdata", (req, res, next) => {
  const product = req.body;
  con.query('SELECT * FROM Product WHERE Id = ?', product.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/deleteproduct", (req, res, next) => {
  const product = req.body;
  con.query('SELECT * FROM Product WHERE Id = ?', product.Id.toString(), function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) {
      con.query('DELETE FROM Product WHERE Id = ?', product.Id.toString(), function(err, row, fields) {
        if(err) throw err;
        res.json("");
      });
    } 
  });
});
//#endregion

app.listen(3000, () => {
  console.log('Server started!')
});

