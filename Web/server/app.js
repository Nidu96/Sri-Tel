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
  con.query('SELECT * FROM systemuser WHERE Username = ?', credentials.Username, function(err, rows, fields) {
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
    con.query('INSERT INTO systemuser SET ?', user, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE systemuser SET name = ?, username = ?, password = ?, active = ?, userrole = ? Where id = ?',
    [user.Name,user.Username, user.Password,user.Active,user.UserRole,user.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }
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
});


app.post("/user/getuserdata", (req, res, next) => {
  const user = req.body;
  con.query('SELECT * FROM systemuser WHERE Id = ?', user.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/user/deleteuser", (req, res, next) => {
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
});

app.post("/user/deletepermissions", (req, res, next) => {
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

});
//#endregion

//#region banners
app.post("/banner/savebanner", (req, res, next) => {
  const banner = req.body;
  if(banner.Id == undefined || banner.Id == null || banner.Id == ""){
    banner.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO banner SET ?', banner, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE banner SET title = ?,image = ?, description = ?, datepublished = ? Where id = ?',
    [banner.Title,banner.Image,banner.Description, banner.DatePublished,banner.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

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
});
//#endregion

//#region categories
app.post("/category/savecategory", (req, res, next) => {
  const category = req.body;
  if(category.Id == undefined || category.Id == null || category.Id == ""){
    category.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO category SET ?', category, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE category SET title = ?, icon = ?,description = ?, datepublished = ? Where id = ?',
    [category.Title,category.Icon,category.Description,category.DatePublished,category.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

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
  const category = req.body;
  con.query('SELECT * FROM category WHERE Id = ?', category.Id.toString(), function(err, rows, fields) {
    if(err) throw err;
    var count = rows.length;
    if (count) {
      con.query('DELETE FROM category WHERE Id = ?', category.Id.toString(), function(err, row, fields) {
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
    con.query('INSERT INTO product SET ?', product, (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }else{
    con.query('UPDATE product SET categoryid = ?, title = ?,image = ?,price = ?, weight = ?,description = ?, datepublished = ? Where id = ?',
    [product.CategoryId,product.Title,product.Image,parseFloat(product.Price),parseInt(product.Weight),product.Description, product.DatePublished,product.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

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

app.post("/product/getproductdata", (req, res, next) => {
  const product = req.body;
  con.query('SELECT * FROM product WHERE Id = ?', product.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/product/deleteproduct", (req, res, next) => {
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
});
//#endregion

//#region orders
app.post("/order/saveorder", (req, res, next) => {
  const order = req.body;
  console.log(order)
  if(order.Id == undefined || order.Id == null || order.Id == ""){
    order.Id = Math.random().toString(7).slice(2);
    con.query('INSERT INTO productorder(Id,IdForCustomer,UserEmail,DeliveryNote,Phone,RecepientName,RecepientPhone,Status,DateofPayment,City) VALUES (?,?,?,?,?,?,?,?,?,?)', 
    [order.Id,order.IdForCustomer,order.UserEmail,order.DeliveryNote,order.Phone,order.RecepientName,order.RecepientPhone,order.Status,order.DateofPayment,order.City], (err, row) => {
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
    con.query('UPDATE order SET status = ? WHERE id = ?',[order.Status,order.Id], (err, row) => {
      if(err) throw err;
      res.json("")
    });
  }

});

app.post("/order/getorders", (req, res, next) => {
  const limit = JSON.parse(req.body);
  con.query('SELECT * FROM productorder ORDER BY DateOfPayment DESC LIMIT ?,?', [parseInt(limit.start),parseInt(limit.end)], (err,rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/order/getorderdata", (req, res, next) => {
  const order = req.body;
  con.query('SELECT * FROM productorder WHERE Id = ?', order.Id.toString(), (err, rows) => {
    if(err) throw err;
    res.json(rows);
  });
});

app.post("/order/deleteorder", (req, res, next) => {
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
});
//#endregion
app.listen(3000, () => {
  console.log('Server started!')
});

