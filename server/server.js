const express = require("express");
const app = express();
const mongoose_app = require("mongoose");  // For App
const mongoose_compiler = require("mongoose") // For Compiler
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { exec } = require('child_process');
const path = require('path');
const cors = require("cors"); 
const twilio = require('twilio');

const accountSid = 'ACb58bc9302f2ec068aa4cc044e05a82d9';
const authToken = '09e63096f9cb5a1f35af5178896dd735';
const client = twilio(accountSid, authToken);

// Compiler imports:
const { generateFile } = require('./CompilerModules/generate_code_file')
const  { executeCode } = require('./CompilerModules/execute_code')
const Job = require('./CompilerModules/models/Job'); // Importing Job for creating each run a job.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors()); 


mongoose_app.connect("mongodb+srv://Aditya:mrnobody@cluster0.9ex6qts.mongodb.net/Chatbot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connecting to localhost for Compiler.
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/compilerapp');
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// Create a login & signup data schema
const loginSchema = {
  userId: String, // Adding userId field
  email: String,
  password: String,
  phoneNumber: String,
}

const signupSchema = {
  userId: String, // Adding userId field
  name: String,
  email: String,
  password: String,
  phoneNumber: String 
}


const Login = mongoose_app.model("Login", loginSchema);
const Signup = mongoose_app.model("Signup", signupSchema);


app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/loginpage");
});

// Login Route
// Login Route
app.post("/login", function (req, res) {
  console.log(req.body); 
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;

  if (!enteredEmail || !enteredPassword) {
    return res.status(400).json({ error: "Invalid request. Email and password are required." });
  }

  Login.findOne({ email: enteredEmail })
    .then((foundUser) => {
      if (foundUser) {
        // Compare entered password with the hashed password
        bcrypt.compare(enteredPassword, foundUser.password, function (err, result) {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "Error occurred during password comparison. Please try again." });
            return;
          }

          if (result) {
            // Passwords match
            res.json({ success: true, message: "Login successful", userId: foundUser.userId });
          } else {
            // Passwords do not match
            res.status(401).json({ error: "User and password do not match. Login failed." });
          }
        });
      } else {
        // User not found
        res.status(404).json({ error: "User not found. Login failed." });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Error occurred during login. Please try again." });
    });
});

// Signup route
const { v4: uuidv4 } = require('uuid');

// Signup route with unique userId
app.post("/signup", function (req, res) {
  const { name, email, password, phoneNumber } = req.body;

  // Generate a unique userId
  const userId = uuidv4();

  // Check if user with the given email already exists
  Signup.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        // User already exists
        res.send("User with this email already exists. Please choose a different email.");
      } else {
        // Hash the password before saving it
        bcrypt.hash(password, 10, function (err, hashedPassword) {
          if (err) {
            console.error(err);
            res.send("Error occurred during signup. Please try again.");
          } else {
            // Create a new user with userId
            const newSignup = new Signup({
              userId: userId,
              name: name,
              email: email,
              password: hashedPassword,
              phoneNumber: phoneNumber,
            });

            // Save the user to the Signup collection
            newSignup.save()
              .then(() => {
                // Update the Login collection as well
                const newLogin = new Login({
                  userId: userId,
                  email: email,
                  password: hashedPassword,
                });

                // Save the user to the Login collection
                newLogin.save()
                  .then(() => {
                    res.json({ success: true, message: "Signup successful! You can now log in.", userId: userId });
                  })
                  .catch((err) => {
                    console.error(err);
                    res.send("Error occurred during signup. Please try again.");
                  });
              })
              .catch((err) => {
                console.error(err);
                res.send("Error occurred during signup. Please try again.");
              });
          }
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.send("Error occurred during signup. Please try again.");
    });
});


// Forgot password route
app.post("/forgotpass", function (req, res) {
  const { email, newpassword } = req.body;

  // Check if the email exists in the database
  Signup.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        // Hash the new password before updating the database
        bcrypt.hash(newpassword, 10, function (err, hashedPassword) {
          if (err) {
            console.error(err);
            res.send("Error occurred during password update. Please try again.");
          } else {
            // Email exists, update password in Signup collection
            foundUser.password = hashedPassword;
            foundUser.save()
              .then(() => {
                // Also update the password in the Login collection
                Login.findOne({ email: email })
                  .then((loginUser) => {
                    if (loginUser) {
                      loginUser.password = hashedPassword;
                      loginUser.save()
                        .then(() => {
                          res.json({ success: true, message: "Login successful" });
                        })
                        .catch((err) => {
                          console.error(err);
                          res.send("Error occurred during password update. Please try again.");
                        });
                    } else {
                      res.send("User not found in the Login collection. Password update failed.");
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    res.send("Error occurred during password update. Please try again.");
                  });
              })
              .catch((err) => {
                console.error(err);
                res.send("Error occurred during password update. Please try again.");
              });
          }
        });
      } else {
        // Email does not exist in the Signup collection
        res.send("Email not found. Password update failed.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.send("Error occurred during password update. Please try again.");
    });
});

app.listen(5000, function () {
  console.log("server is running on 5000");
});


//OTP API
app.post('/send-otp', (req, res) => {
  const { to } = req.body;

  // Generate a random 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Send OTP via Twilio SMS
  client.messages
    .create({
      body: `Your OTP is: ${otp}`,
      from: '+12563447933',
      to: to,
    })
    .then(() => {
      res.json({ success: true, otp });
    })
    .catch((error) => {
      console.error('Error sending OTP:', error);
      res.status(500).json({ success: false, message: 'Error sending OTP' });
    });
});


// Compiler Route:
app.post("/run", async (req, res) => {
  // Language = C 
  const { language = "c", code } = req.body;
  // console.log(language, code.length);

  // Check if code is given or not
  if(code === undefined)
  {
      return res.status(400).json({success: false, error: "Empty code body"})
  }

  let job;

  try {
      // Generate a c file with content from the request
      const filepath = await generateFile(language, code);
      console.log(filepath);

      job = await new Job({language, filepath}).save();
      const jobId = job["_id"];
      
      res.status(200).json({success: true, jobId});
      
      job["startedAt"] = new Date();
      // Run the file and send the response back
      const output = await executeCode(filepath);
      console.log({filepath, output});
      
      job["completedAt"] = new Date();
      job["status"] = "success";
      job["output"] = output;
      
      await job.save();
      
      console.log(job);
      // return res.json({ filepath, output });
  } catch (err)
  {
      job["compeltedAt"] = new Date();
      job["status"] = "error";
      job["output"] = JSON.stringify(err);
      await job.save();
      console.log(err);
      // res.status(500).json({ err });
  }
});

app.get("/status", async(req, res) => {
  const jobId = req.query.id;

  if(jobId == undefined)
  {
      return res.status(400).json({success: false, error: "missing id query param"})
  }

  try {
      const job = await Job.findById(jobId);

      if(job === undefined)
      {
          return res.status(404).json({success: false, error: "invalid job id"});
      }

      return res.status(200).json({success: true, job});
  } catch (error) {
      return res.status(400).json({success: false, error: JSON.stringify(err)});
  }

})



// Define schema for user messages
const messageSchema = new mongoose_app.Schema({
  userId: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

// Create model based on schema
const Message = mongoose_app.model("Message", messageSchema);

// Route to receive and store user messages
app.post("/user-message", async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Create a new message document
    const newMessage = new Message({ userId, message });

    // Save the message to the database
    await newMessage.save();

    // Send response
    res.status(200).json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Error saving message" });
  }
});

// Route to retrieve recent chats for a specific user
app.get("/recent-chats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find recent messages for the specified user
    const recentChats = await Message.find({ userId })
      .select('message timestamp') // Project only the 'message' and 'timestamp' fields
      .sort({ timestamp: 1 }) // Sort messages by timestamp in ascending order
      .limit(10000); // Limit to the 10 most recent messages

    // Send the recent chats as a response
    res.status(200).json({ success: true, recentChats });
  } catch (error) {
    console.error("Error retrieving recent chats:", error);
    res.status(500).json({ success: false, error: "Error retrieving recent chats" });
  }
});



//Quiz Progress
const quizProgressSchema = new mongoose_app.Schema({
  userId: { type: String, required: true },
  sectionIndex: { type: Number, required: true },
  completed: { type: Boolean, default: false },
});

const QuizProgress = mongoose_app.model('QuizProgress', quizProgressSchema);

// Update quiz progress route
app.post("/update-quiz-progress", async (req, res) => {
  try {
    const { userId, sectionIndex, completed } = req.body;

    // Find existing quiz progress for the user and section
    let quizProgress = await QuizProgress.findOne({ userId, sectionIndex });

    // If quiz progress doesn't exist, create a new record
    if (!quizProgress) {
      quizProgress = new QuizProgress({ userId, sectionIndex, completed });
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

// Get quiz progress route
app.get("/quiz-progress/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find quiz progress for the specified user
    const quizProgress = await QuizProgress.find({ userId });

    // Send the quiz progress as a response
    res.status(200).json({ success: true, quizProgress });
  } catch (error) {
    console.error("Error retrieving quiz progress:", error);
    res.status(500).json({ success: false, error: "Error retrieving quiz progress" });
  }
});



//Profile Data
app.get("/user-details/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user details based on userId in the Signup collection
    const user = await Signup.findOne({ userId });

    if (!user) {
      // If user not found, send an error response
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Extract Name, Email, and Phone Number from the user object
    const { name, email, phoneNumber } = user;

    // Send the extracted user details as a response
    res.status(200).json({ success: true, name, email, phoneNumber });
  } catch (error) {
    // Handle errors
    console.error("Error retrieving user details:", error);
    res.status(500).json({ success: false, error: "Error retrieving user details" });
  }
});



//clear chat button 
app.delete("/clear-chat/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Delete all documents with the given userId
    const result = await Message.deleteMany({ userId });

    res.status(200).json({ success: true, message: `Deleted ${result.deletedCount} messages for user ${userId}` });
  } catch (error) {
    console.error("Error clearing chat:", error);
    res.status(500).json({ success: false, error: "Error clearing chat" });
  }
});

//Delete whole account :)
app.delete("/delete-account/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { password } = req.body;

  try {
    // Retrieve hashed password from the database
    const user = await Signup.findOne({ userId });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Compare the entered password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: "Incorrect password" });
    }

    // Password matches, delete user account and associated data
    await Login.deleteOne({ userId });
    await Signup.deleteOne({ userId });
    await Message.deleteMany({ userId });
    await QuizProgress.deleteMany({ userId });

    res.status(200).json({ success: true, message: `Deleted account and associated data for user ${userId}` });
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ success: false, error: "Error deleting account" });
  }
});

const axios = require('axios');

app.post("/compile", async (req, res) => {
  // Extracting data from the request
  let code = req.body.code;
  let language = req.body.language;
  let input = req.body.input;

  // Only process requests for the C language
  if (language.toLowerCase() !== "c") {
      return res.status(400).json({ error: "Only C language is supported" });
  }

  const options = {
      method: 'POST',
      url: 'https://online-code-compiler.p.rapidapi.com/v1/',
      headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '4d46ead6e6mshd7bbbfa3e0502c1p122c05jsn68ea42912c42',
          'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
      },
      data: {
          language: 'c',
          version: 'latest',
          code: code,
          input: input
      }
  };

  try {
      const response = await axios.request(options);
      res.send(response.data);
      console.log(response.data);
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});


