const express = require('express');
const User = require('./../models/userSchema.js');
const Quiz = require('./../models/quizSchema.js');
const UserMessage  =  require('./../models/userMessageSchema.js');

const userRouter = express.Router();

userRouter.get("/user-details/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user details based on userId in the Signup collection
        const user = await User.findById({ _id: userId });

        if (!user) {
            // If user not found, send an error response
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Extract Name, Email, and Phone Number from the user object
        const { name, email, phoneNumber } = user;

        // Send the extracted user details as a response
        res.status(200).json({ success: true, name, email, phoneNumber });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: "Error retrieving user details" });
    }
})

userRouter.get("/", async (req, res) => {
    try {
        const userList = await User.find();
        return res.status(200).json({
            count: userList.length,
            data: userList
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({success: false, error: err})
    }
})

userRouter.delete("/delete-user/:userId", async (req, res) => {
    const userId = req.params.userId;
    const { password } = req.body;
    
    try {
        // Retrieve hashed password from the database
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Compare the entered password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: "Incorrect password" });
        }

        // Password matches, delete user account and associated data
        await User.deleteOne({ userId });
        await UserMessage.deleteMany({ userId });
        await Quiz.deleteMany({ userId });

        res.status(200).json({ success: true, message: `Deleted account and associated data for user ${userId}` });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ success: false, error: "Error deleting account" });
    }
})


module.exports =  userRouter;
