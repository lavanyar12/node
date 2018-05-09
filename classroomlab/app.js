//Code from https://code.tutsplus.com/articles/bulk-import-a-csv-file-into-mongodb-using-mongoose-with-nodejs--cms-29574

const express = require('express')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const app = express()
const server = require('http').Server(app)

app.use(fileUpload())

const port = 5000
server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})

//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//connect to mongoose remote DB on mlab or local DB
mongoose.connect('mongodb://localhost/csvimport', {
  //useMongoClient: true - not needed in newer Mongo
})
  .then(() => console.log('Connection to MongoDB successful'))
  .catch(err => console.log(err))

  // Handlebars middleware - setting the engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//allows access to whatever is submitted in the form body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// body parser middleware parse application/json
app.use(bodyParser.json())


var Lesson = require('./models/lesson');
var Subject = require('./models/subject');

app.get('/lessons', (req, res) => {
  Lesson.find({})
  .then(lessons => {
    res.render('lessons/index', {
      lessons: lessons
    })
  })
})

app.get('/lessons/:subject/:semester', (req, res) => {
  Lesson.find({
    subject: req.params.subject,
    semester: req.params.semester
  })
  .then(lessons => {
    res.render('lessons/index', {
      lessons: lessons
    })
  })
})

app.get('/subjects', (req, res) => {
  //res.render('about')
  
  Subject.find({})
  .then(subjects => {
      res.render('lessons/subject', {
          subjects: subjects
      })
    })
})

//About route
app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/upload', function (req, res) {
  res.sendFile(__dirname + '/upload.html')
});

const template = require('./template.js')
app.get('/template', template.get)

const upload = require('./upload.js')
app.post('/', upload.post)
