const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
        },
        message: {
            type: String,
        }
    },
    {
        timestamps: {
            type: Date,
            default: Date.now
        }
    }
)

const UserMessage = mongoose.model('UserMessage', messageSchema);
module.exports = UserMessage;
