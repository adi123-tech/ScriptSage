const express = require('express');
const User = require('./../models/userSchema.js')
const twilio = require('twilio');
const {accountSid, authToken} = require('./../config.js');
const bcrypt = require("bcrypt");

const client = twilio(accountSid, authToken);

const authRouter = express.Router();

authRouter.post("/login", function (req, res) {
    console.log(req.body); 
    const enteredEmail = req.body.email;
    const enteredPassword = req.body.password;

    console.log(enteredPassword, enteredEmail);
  
    if (!enteredEmail || !enteredPassword) {
      return res.status(400).json({ error: "Invalid request. Email and password are required." });
    }
  
    User.findOne({ email: enteredEmail })
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

  const { v4: uuidv4 } = require('uuid');


// Signup route with unique userId
authRouter.post("/signup", function (req, res) {
  const { name, email, password, phoneNumber } = req.body;

  // Generate a unique userId
  const userId = uuidv4();

  // Check if user with the given email already exists
  User.findOne({ email: email })
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
            console.log(userId, name, email, hashedPassword, phoneNumber)
            const newSignup = new User({
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
                const newLogin = new User({
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

authRouter.post("/forgotpass", function (req, res) {
    const { email, newpassword } = req.body;
  
    // Check if the email exists in the database
    User.findOne({ email: email })
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
                  User.findOne({ email: email })
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

authRouter.post('/send-otp', (req, res) => {
    const { to } = req.body;
  
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    console.log(otp);
  
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

authRouter.get("/", async (req, res) => {
    try {
        console.log("Auth Route Working");
        res.status(200).json({success: true})
    } catch (error) {
        console.log({message: error.message});
    }
});

module.exports =  authRouter;
