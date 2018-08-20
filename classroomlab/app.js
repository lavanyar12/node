//Code from https://code.tutsplus.com/articles/bulk-import-a-csv-file-into-mongodb-using-mongoose-with-nodejs--cms-29574

const express = require('express')
const fileUpload = require('express-fileupload')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const validate = require("validate.js")
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('passport')

const app = express()
const server = require('http').Server(app)

//Load routes (in routes folder - subjects/lessons/users/...)
const lessons = require('./routes/lessons')
const subjects = require('./routes/subjects')
const users = require('./routes/users')

//Passport Config - load local strategy
require('./config/passport')(passport)

//proxy to serve css, img and js folders in views
app.use('/public', express.static('views'))
//Static folder
app.use(express.static(path.join(__dirname, 'public')))

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
  defaultLayout: 'default',
  helpers: { //not used yet
    section: function(name, options) { 
      if (!this._sections) this._sections = {};
        this._sections[name] = options.fn(this); 
        return null;
      }
  }    
}))
app.set('view engine', 'handlebars');

// Body parser middleware
// allows access to whatever is submitted in the form body
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// method override middleware - overriding PUT and DELETE methods
app.use(methodOverride('_method'))

// Express session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//for flash messaging
app.use(flash());

// Global variables for messages
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null
  next();
});

var Subject = require('./models/subject');

//About route
app.get('/about', (req, res) => {
  Subject.find({})
    .sort({ name: 'asc' })
    .then(subjects => {
      res.render('about', {
        subjects: subjects,
        layout: 'main'
      })
    })
})

// HOME page
app.get('/home', (req, res) => {
  res.render('home', {
    layout: 'main'
  })
})

//-------------- UPLOAD AND GET CSV TEMPLATE ROUTES
app.use(fileUpload())

const template = require('./template.js')
app.get('/template', template.get)

const upload = require('./upload.js')
app.post('/', upload.post)

app.get('/upload', function (req, res) {
  res.sendFile(__dirname + '/upload.html')
});

app.get('/pay', function (req, res) {
  res.render('payments/pay', {
     layout: 'main'
  })
});

//Use routes
app.use('/lessons', lessons)
app.use('/subjects', subjects)
app.use('/users', users)

const port = 5000

server.listen(port, () => {
  console.log(`Server started on port ${port}`)
})