const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { exec } = require('child_process');
const path = require('path');
const cors = require("cors"); 
const twilio = require('twilio');

const accountSid = 'ACb2d2a6519d69b54e69450fb5e90c2e9f';
const authToken = 'd0025b478653d89c1d061e5c761eedd0';
const client = twilio(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 


mongoose.connect("mongodb+srv://Aditya:mrnobody@cluster0.9ex6qts.mongodb.net/Chatbot", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Create a login & signup data schema
const loginSchema = {
  email: String,
  password: String,
  phoneNumber: String,
}
const signupSchema = {
  name: String,
  email: String,
  password: String,
  phoneNumber: String 
}

const Login = mongoose.model("Login", loginSchema);
const Signup = mongoose.model("Signup", signupSchema);


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
            res.json({ success: true, message: "Login successful" });
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
app.post("/signup", function (req, res) {
  const { name, email, password, phoneNumber } = req.body;

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
            // Create a new user
            const newSignup = new Signup({
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
                  email: email,
                  password: hashedPassword,
                });

                // Save the user to the Login collection
                newLogin.save()
                  .then(() => {
                    res.send("Signup successful! You can now log in.");
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
      from: '+16592216878',
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





