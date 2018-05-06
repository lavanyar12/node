var mongoose = require('mongoose');

//subject	semester	notebook.id	notebook.title	notebook.description	notebook.video.title	notebook.video.link	notebook.career.title	notebook.career.link	notebook.detailsLink	notebook.mathSkill

var lessonSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    subject: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    notebook: {
        id: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        video: {
            title: {
                type: String,
                required: true
            },
            link: String
        },
        career: {
            title: {
                type: String,
                required: true
            },
            link: String
        },
        detailsLink: String,
        mathSkill: String,
        image: String
    }
 });
 
var Lesson = mongoose.model('Lesson', lessonSchema);
 
module.exports = Lesson;