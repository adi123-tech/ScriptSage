const express = require('express');
const Quiz= require('./../models/quizSchema');

const quizRouter = express.Router();

quizRouter.get('/', async (req, res) => {
  res.send("User working");
})

quizRouter.post("/update-quiz-progress", async (req, res) => {
    try {
      const { userId, sectionIndex, completed } = req.body;
  
      // Find existing quiz progress for the user and section
      let quizProgress = await Quiz.findOne({ userId, sectionIndex });
  
      // If quiz progress doesn't exist, create a new record
      if (!quizProgress) {
        quizProgress = new Quiz({ userId, sectionIndex, completed });
      } else {
        // Update existing quiz progress
        quizProgress.completed = completed;
      }
  
      // Save the updated quiz progress
      await quizProgress.save();
  
      // Send success response
      res.status(200).json({ success: true, message: "Quiz progress updated successfully" });
    } catch (error) {
      console.error("Error updating quiz progress:", error);
      res.status(500).json({ success: false, error: "Error updating quiz progress" });
    }
  });


quizRouter.get("/quiz-progress/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Find quiz progress for the specified user
      const quizProgress = await Quiz.find({ userId });
  
      // Send the quiz progress as a response
      res.status(200).json({ success: true, quizProgress });
    } catch (error) {
      console.error("Error retrieving quiz progress:", error);
      res.status(500).json({ success: false, error: "Error retrieving quiz progress" });
    }
  });

module.exports = quizRouter;
