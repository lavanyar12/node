const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
var methodOverride = require('method-override')

//using const ES6 syntax instead of using var
//create app to initialize application
const app = express()

//Map global promise - get rid of warning
mongoose.Promise = global.Promise

//connect to mongoose remote DB on mlab or local DB
mongoose.connect('mongodb://localhost/vidjot-dev', {
  //useMongoClient: true - not needed in newer Mongo
})
  .then(() => console.log('Connection to MongoDB successful'))
  .catch(err => console.log(err))

// load Idea mdel
require('./models/Idea')
const Idea = mongoose.model('ideas')

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

// Index route
//to handle GET request to '/' 
//localhost:5000/ - handle HTTP requests
app.get('/', (req, res) => {
  const title = 'Welcome'
  res.render('index', {
    title: title
  })
})

//About route
app.get('/about', (req, res) => {
  res.render('about')
})

// Idea index page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({ date: 'desc' })
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      })
    })
})
// add idea form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

// edit idea form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
      res.render('ideas/edit', {
        idea:idea
    })
  })
})

//Process form
app.post('/ideas', (req, res) => {
  console.log(req.body)
  let errors = []

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' })
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' })
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details
      //user: req.user.id for later
    }
    new Idea(newUser)
      .save()
      .then(idea => {
        res.redirect('/ideas')
      })
  }
})

//edit form process
app.put('/ideas/:id', (req,res) => {
  Idea.findOne({
    _id: req.params.id
  })
    .then(idea => {
      //new values
      idea.title = req.body.title,
      idea.details = req.body.details
      idea.save()
        .then(idea => {
          res.redirect('/ideas')
        })
    })
    
})

// Delete idea
app.delete('/ideas/:id', (req,res) => {
  //res.send('DELETE') - below remove() will also work
  Idea.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      res.redirect('/ideas')
    })
})

const port = 5000

//locahost:5000 - ES6 uses => instead of function() syntax
//` is used instead of + for concat
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})


