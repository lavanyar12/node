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
  defaultLayout: 'default'
}));
app.set('view engine', 'handlebars');

// allows access to whatever is submitted in the form body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// body parser middleware parse application/json
app.use(bodyParser.json())

// method override middleware - overriding PUT and DELETE methods
app.use(methodOverride('_method'))

//-------------------------LESSONS ------------------------//

// GET All lessons route
app.get('/lessons', (req, res) => {
  Lesson.find({})
    .sort({ subject: 'asc' })
    .sort({ semester: 'asc' })
    .sort({ lessonId: 'asc' })
    .then(lessons => {
      const count = lessons.length
      res.render('lessons/index', {
        lessons: lessons,
        count: count
      })
    })
})

// --------- ADD Lessons form
app.get('/lessons/add', (req, res) => {
  res.render('lessons/add')
})

// --------- GET Lesson by id for EDIT form
app.get('/lessons/edit/:id', (req, res) => {
  Lesson.findOne({
    _id: req.params.id
  })
    .then(lesson => {
      res.render('lessons/edit', {
        lesson: lesson
      })
    })
})

// --------- DELETE Lesson
app.delete('/lessons/:id', (req, res) => {
  //res.send('DELETE') - below remove() will also work
  Subject.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/lessons')
    })
})

//---------- Process EDIT Lessons form (PUT)
app.put('/lessons/:id', (req, res) => {
  Lesson.findOne({
    _id: req.params.id
  })
    .then(lesson => {

      //new values
      lesson.subject = req.body.subject,
        lesson.semester = req.body.semester,
        lesson.lessonId = req.body.lessonId,
        lesson.title = req.body.title,
        lesson.description = req.body.description,
        lesson.videoTitle = req.body.videoTitle,
        lesson.videoLink = req.body.videoLink,
        lesson.careerTitle = req.body.careerTitle,
        lesson.careerLink = req.body.careerLink,
        lesson.movieTitle = req.body.movieTitle,
        lesson.movieLink = req.body.movieLink,
        lesson.documentLink = req.body.documentLink,
        lesson.image = req.body.image

      lesson.save()
        .then(lesson => {
          res.redirect('/lessons')
        })
    })

})

// GET Lessons by subject and semester # - VIEW only
app.get('/lessons/view/:subject/:semester', (req, res) => {
  Lesson.find({
    subject: req.params.subject,
    semester: req.params.semester
  })
    .sort({ 'lessonId': 'asc' })
    .then(lessons => {

      const count = lessons.length
      res.render('lessons/view', {
        lessons: lessons,
        count: count,
        subject: req.params.subject,
        semester: req.params.semester,
        layout: 'main'
      })
    })
})


// GET Lessons by subject and semester #
app.get('/lessons/:subject/:semester', (req, res) => {
  Lesson.find({
    subject: req.params.subject,
    semester: req.params.semester
  })
    .sort({ 'lessonId': 'asc' })
    .then(lessons => {

      const count = lessons.length
      res.render('lessons/index', {
        lessons: lessons,
        count: count,
        subject: req.params.subject,
        semester: req.params.semester
      })
    })
})

//---------- Process ADD form (POST)
app.post('/lessons', (req, res) => {
  let errors = []
  if (errors.length > 0) {
    res.render('lessons/add', {
      errors: errors,
      subject: req.body.subject,
      semester: req.body.semester,
      lessonId: req.body.lessonId,
      title: req.body.title,
      description: req.body.description,
      videoTitle: req.body.videoTitle,
      videoLink: req.body.videoLink,
      careerTitle: req.body.careerTitle,
      careerLink: req.body.careerLink,
      movieTitle: req.body.movieTitle,
      movieLink: req.body.movieLink,
      documentLink: req.body.documentLink,
      image: req.body.image
    })
  } else {

    const newUser = {
      subject: req.body.subject,
      semester: req.body.semester,
      notebook: req.body.notebook,
      lessonId: req.body.lessonId,
      title: req.body.title,
      description: req.body.description,
      videoTitle: req.body.videoTitle,
      videoLink: req.body.videoLink,
      careerTitle: req.body.careerTitle,
      careerLink: req.body.careerLink,
      movieTitle: req.body.movieTitle,
      movieLink: req.body.movieLink,
      documentLink: req.body.documentLink,
      image: req.body.image
      //user: req.user.id for later
    }

    new Lesson(newUser)
      .save()
      .then(lesson => {
        res.redirect('/lessons')
      })
  }
})
// END

// BEGIN
//-------------------SUBJECT ROUTES ------------------------//
// GET All Subjects route
app.get('/subjects', (req, res) => {

  Subject.find({})
    .sort({ name: 'asc' })
    .then(subjects => {
      res.render('subjects/index', {
        subjects: subjects
      })
    })
})

// --------- ADD Subject form
app.get('/subjects/add', (req, res) => {
  res.render('subjects/add')
})

// --------- GET Subject by id for EDIT form
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

// --------- DELETE Subject
app.delete('/subjects/:id', (req, res) => {
  //res.send('DELETE') - below remove() will also work
  Subject.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/subjects')
    })
})

//---------- Process EDIT Subject form (PUT)
app.put('/subjects/:id', (req, res) => {
  Subject.findOne({
    _id: req.params.id
  })
    .then(subject => {

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

//---------- Process ADD form (POST)
app.post('/subjects', (req, res) => {
  let errors = []

  if (!req.body.code) {
    errors.push({ text: 'Please add a code' })
  }
  if (!req.body.type) {
    errors.push({ text: 'Please add type' })
  }
  if (!req.body.name) {
    errors.push({ text: 'Please add name' })
  }

  if (errors.length > 0) {
    res.render('subjects/add', {
      errors: errors,
      code: req.body.code,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      folderLink: req.body.folderLink,
      image: req.body.image
    })
  } else {
    const newUser = {
      code: req.body.code,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description,
      folderLink: req.body.folderLink,
      image: req.body.image
      //user: req.user.id for later
    }
    new Subject(newUser)
      .save()
      .then(subject => {
        res.redirect('/subjects')
      })
  }
})

//-------------- UPLOAD AND GET CSV TEMPLATE ROUTES
const template = require('./template.js')
app.get('/template', template.get)

const upload = require('./upload.js')
app.post('/', upload.post)

//About route
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'main'
  })
})

app.get('/upload', function (req, res) {
  res.sendFile(__dirname + '/upload.html')
});

// HOME page
app.get('/home', (req, res) => {
  res.render('home', {
    layout: 'main'
  })
})

// HOME page
app.get('/', (req, res) => {
  res.render('home', {
    layout: 'main'
  })
})



