const express = require('express')
const router = express.Router()

module.exports = router

var Lesson = require('../models/lesson');
var Subject = require('../models/subject');

//-------------------------LESSONS ------------------------//

// GET All lessons route
router.get('/', (req, res) => {
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
router.get('/add', (req, res) => {
  res.render('lessons/add')
})

// --------- GET Lesson by id for EDIT form
router.get('/edit/:id', (req, res) => {
  
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
router.delete('/:id', (req, res) => {
  Lesson.deleteOne({
    _id: req.params.id
  })
    .then(() => {
      req.flash('success_msg', 'Lesson deleted');
      res.redirect('/lessons')
    })
  // console.log(req.params.id)
  // res.redirect('/lessons')
})

//---------- Process EDIT Lessons form (PUT)
router.put('/:id', (req, res) => {
  console.log(req.body)
  Lesson.findOne({
    _id: req.params.id
  })
    .then(lesson => {

      console.log(lesson)
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
          req.flash('success_msg', 'Lesson saved');
          res.redirect('/lessons')
        })
    })

})

// GET Lessons by subject and semester # - VIEW only
router.get('/view/:subject/:semester', (req, res) => {
  Subject.find({}).then((results) => {
    var subjectObj = getByKey(results, req.params.subject)
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
          subject: subjectObj.name,
          semester: req.params.semester,
          layout: 'main'
      })
    })
  })
})


// GET Lessons by subject and semester # - VIEW / EDIT
router.get('/:subject/:semester', (req, res) => {
  Subject.find({}).then((results) => {
    var subjectObj = getByKey(results, req.params.subject)
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
        subject: subjectObj.name,
        semester: req.params.semester
      })
    })
  })
})

//---------- Process ADD form (POST)
router.post('/', (req, res) => {
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
        req.flash('success_msg', 'Lesson added');
        res.redirect('/lessons')
      })
  }
})
// END

function getByKey(results, key) {
  var object
  for (var i = 0; i < results.length; i++) {
    if (results[i].code === key) {
      object = results[i]
    }
  }
  return object
}
