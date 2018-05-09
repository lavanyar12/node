var mongoose = require('mongoose');
const Schema = mongoose.Schema

//create schema
var lessonSchema = Schema({
    //_id: mongoose.Schema.Types.ObjectId,
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
            type: String
        },
        video: {
            title: {
                type: String
            },
            link: String
        },
        career: {
            title: {
                type: String
            },
            link: String
        },
        movie: {
            title: {
                type: String,
                required: true
            },
            link: String
        },
        documentLink: String,
        image: String
    }
 })

var Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;
