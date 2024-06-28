const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
        },
        sectionIndex: {
            type: Number,
            required: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: {
            type: Date,
            default: Date.now
        }
    }
)

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
