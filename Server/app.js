import * as express from 'express'

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 next();
}); 

app.listen(3000, () => {
  console.log('Server started!')
});
