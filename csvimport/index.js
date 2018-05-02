//Code from https://code.tutsplus.com/articles/bulk-import-a-csv-file-into-mongodb-using-mongoose-with-nodejs--cms-29574

const express = require('express')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
 
const app = express()
const server = require('http').Server(app)

app.use(fileUpload())

server.listen(8000)

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose remote DB on mlab or local DB
mongoose.connect('mongodb://localhost/csvimport', {
  //useMongoClient: true - not needed in newer Mongo
})
  .then(() => console.log('Connection to MongoDB successful'))
  .catch(err => console.log(err)) 
 
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
});
 
const template = require('./template.js')
app.get('/template', template.get)
 
const upload = require('./upload.js')
app.post('/', upload.post)
