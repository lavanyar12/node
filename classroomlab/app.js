//Code from https://code.tutsplus.com/articles/bulk-import-a-csv-file-into-mongodb-using-mongoose-with-nodejs--cms-29574

const express = require('express')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
var methodOverride = require('method-override')

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

var Lesson = require('./models/lesson');
var Subject = require('./models/subject');

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

// method override middleware - overriding PUT for edit idea
app.use(methodOverride('_method'))

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

// subjects GET route
app.get('/subjects', (req, res) => {
  //res.render('about')

  Subject.find({})
    .then(subjects => {
      res.render('subjects/index', {
        subjects: subjects
      })
    })
})

// subjects ADD form
app.get('/subjects/add', (req, res) => {
  res.render('subjects/add')
})

// subject EDIT form
app.get('/subjects/edit/:id', (req, res) => {
  Subject.findOne({
    _id: req.params.id
  })
    .then(subject => {
      res.render('subjects/edit', {
        subject: subject
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

//edit form process
app.put('/subjects/:id', (req,res) => {
  Subject.findOne({
    _id: req.params.id
  })
    .then(subject => {

      console.log(req.body)
      //new values
      subject.code = req.body.code,
      subject.type = req.body.type,
      subject.name = req.body.name,
      subject.description = req.body.description,
      subject.folderLink = req.body.folderLink,
      subject.image = req.body.image,
      
      subject.save()
        .then(subject => {
          res.redirect('/subjects')
        })
    })
    
})

// Delete subject
app.delete('/subjects/:id', (req,res) => {
  //res.send('DELETE') - below remove() will also work
  Subject.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/subjects')
    })
})

//Process form
app.post('/subjects', (req, res) => {
  console.log(req.body)
  let errors = []

  if (!req.body.code) {
    errors.push({ text: 'Please add a code' })
  }
  if (!req.body.name) {
    errors.push({ text: 'Please add name' })
  }

  if (errors.length > 0) {
    res.render('subjects/add', {
      errors: errors,
      code: req.body.code,
      name: req.body.name
    })
  } else {
    const newUser = {
      code: req.body.code,
      name: req.body.name
      //user: req.user.id for later
    }
    new Subject(newUser)
      .save()
      .then(subject => {
        res.redirect('/subjects')
      })
  }
})

const template = require('./template.js')
app.get('/template', template.get)

const upload = require('./upload.js')
app.post('/', upload.post)
