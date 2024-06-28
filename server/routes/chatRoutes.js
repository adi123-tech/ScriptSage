const express  = require('express');
const UserMessage = require('./../models/userMessageSchema.js');

const chatRouter = express.Router();

chatRouter.get("/", async (req, res) => {
    try {
        console.log("Chat route is working.");
        res.status(200).json({success: true});
    } catch (error) {
        res.status(500).send({message: error.message})
    }
})

chatRouter.post("/user-message", async (req, res) => {
    try {
        const { userId, message } = req.body;

        // Create a new message document
        const newMessage = new UserMessage({ userId, message });

        // Save the message to the database
        await newMessage.save();

        // Send response
        res.status(200).json({ success: true, message: "Message saved successfully" });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
})

chatRouter.get("/recent-chats/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const recentChats = await UserMessage.find({userId})
        .select('Message timestamp')
        .sort({timestamp: 1})
        .limit(10);

        res.status(200).json({success: true, recentChats});
    } catch (err) {
        console.log(err.message);
        res.status(500).send({message: err.message});
    }
})


chatRouter.delete("/clear-chat/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const result = await UserMessage.deleteMany({ userId });

        res.status(200).json({ success: true, message: `Deleted ${result.deletedCount} messages for user ${userId}` });
    } catch (error) {
        console.error("Error clearing chat:", error);
        res.status(500).json({ success: false, error: "Error clearing chat" });
    }
})


module.exports = chatRouter;
