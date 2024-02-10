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

app.listen(3000, () => {
  console.log('Server started!')
});


