const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require('./routes/authRoutes');
const chatRouter = require('./routes/chatRoutes');
const compilerRouter = require('./routes/compilerRoutes');
const quizRouter  = require('./routes/quizRoutes');
const userRouter = require('./routes/userRoutes');
const bodyParser = require('body-parser')


const { PORT, dbLink } = require('./config');
const app = express();

// Middleware:
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors()); 
app.use(express.static(__dirname));



// Routes:
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/user', userRouter);
app.use('/quiz', quizRouter);
app.use('/compiler', compilerRouter);

mongoose.connect(dbLink,{}).then((req, res) => {
  console.log("Database connected.");
}).catch((error) => {
  console.log(error.message);
})

// APP:
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/loginpage");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})


// Create a login & signup data schema



// Login Route
// Login Route


// Signup route



// Forgot password route

//OTP API



// Define schema for user messages


// Create model based on schema

// Route to receive and store user messages

// Route to retrieve recent chats for a specific user




//Quiz Progress


// Update quiz progress route


// Get quiz progress route



//Profile Data




//clear chat button 

//Delete whole account :)



