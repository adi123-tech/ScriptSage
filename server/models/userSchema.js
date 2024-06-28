const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: 'Email Address is required',
        },
        password: {
            type: String,
            required: 'Enter the password'
        },
        phoneNumber: {
            type: Number,
            required: 'Phone number is required.'
        },
    }
)

const User = mongoose.model('User', userSchema);
module.exports = User;
