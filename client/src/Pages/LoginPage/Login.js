import React, { useEffect, useState, useRef,useContext } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import "./login.css";
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword ,validateIndianPhoneNumber } from './validationUtils';
import { useUser } from '../../UserContext';
import CombineLogo from '../CombineLogoPage/CombineLogo';
import { NavLink } from 'react-router-dom';


function Login({ handleLoginStatus }) {
  const { setUserId } = useUser(); 
  const navigate = useNavigate();
  const [otpInputs, setOtpInputs] = useState(Array(4).fill(''));
  const sendOtpButtonRef = useRef(null);
  const verifyOtpButtonRef = useRef(null);
  const signupButtonRef = useRef(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showVerifyButton, setShowVerifyButton] = useState(false);
  const [showSignUpButton, setShowSignUpButton] = useState(false);
  // Inside your Login component
  const [emailValidation, setEmailValidation] = useState('');
  const [passwordValidation, setPasswordValidation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberValidation, setPhoneNumberValidation] = useState('');
// Inside your Login component
// Inside your Login component
const errorStyle = {
  color: 'red',
  fontSize: '10px',
  marginTop: '5px',
  fontFamily: 'Arial, sans-serif', // Add your desired font-family here
  fontStyle: 'italic', 
  fontWeight: 'bold',
};





  
  //email section for otp 
  const [error, setError] = useState(false)
  const formRef = useRef();
  const [success, setSuccess] = useState(false)
  const [otpSent, setOtpSent] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
  
    try {
      const phoneNumberInput = document.querySelector('input[name="phoneNumber"]');
      const phoneNumberValue = phoneNumberInput.value;
      const response = await axios.post('http://localhost:5000/send-otp', {
        to: `+91${phoneNumberValue}`, //Use my number only
      });

    
  
      if (response.data.success) {
        console.log('OTP sent successfully:', response.data.otp);
        setOtpSent(response.data.otp); // Set the correct state here
        setShowVerifyButton(true);
        setShowSignUpButton(false);
        setOtpVerified(false);
  
        if (sendOtpButtonRef.current) {
          sendOtpButtonRef.current.clicked = true;
        }
      } else {
        console.error('Failed to send OTP:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };
  
  

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    try {
      const enteredOtp = otpInputs.map(Number).join('');
      const enteredOtpNumber = parseInt(enteredOtp, 10);
      const storedOtp = parseInt(otpSent, 10);
  
      // Directly compare the entered OTP with the stored OTP
      const isOtpValid = verifyOtpFunction(storedOtp, enteredOtpNumber);
  
      if (isOtpValid) {
        setOtpVerified(true);
        setShowVerifyButton(false);
        setShowSignUpButton(true);
      } else {
        console.error('Invalid OTP');
        setOtpInputs(Array(4).fill(''));
        // Add any other logic or UI update for an invalid OTP
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Handle the error, if any
    }
  };

  function verifyOtpFunction(userEnteredOtp, sentOtp) {
    // Compare userEnteredOtp with the stored OTP
    // Return true if the OTP is valid, false otherwise
    return userEnteredOtp === sentOtp;
  }
  
  
  
  
  
  
  
  
  
  useEffect(() => {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    signUpButton.addEventListener('click', () => {
      container.classList.add('right-panel-active');
    });

    signInButton.addEventListener('click', () => {
      container.classList.remove('right-panel-active');
    });

    // Cleanup event listeners when the component unmounts
    return () => {
      signUpButton.removeEventListener('click', () => {
        container.classList.add('right-panel-active');
      });
      signInButton.removeEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    };
  }, []);

  const handleOtpInputChange = (index, value) => {
    // Check if OTP has been generated, if yes, return early
  
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    setOtpInputs(newOtpInputs);
  };
  
  const [loginError, setLoginError] = useState(false);


  useEffect(() => {
    // Assign the ref values after the component mounts
    sendOtpButtonRef.current = document.getElementById('sendOtpButton');
    verifyOtpButtonRef.current = document.getElementById('verifyOtpButton');
    signupButtonRef.current = document.getElementById('signupbutton'); // Assuming the ID of your signup button is 'signupbutton'
  }, [sendOtpButtonRef, verifyOtpButtonRef, signupButtonRef]);
  
  
  
  const handleOtpInputKeyUp = (e, index) => {
    const currentInput = e.target;
    const nextInput = document.getElementById(`otp${index + 2}`);
    const prevInput = document.getElementById(`otp${index - 1}`);
    console.log("Current Index:", index);
    if (e.key === 'Backspace') {
      currentInput.hasAttribute('disabled')
      if (index === 1) {
        // If backspacing from index 1, focus on index 0
        const firstInput = document.getElementById('otp1');
        if (firstInput) {
          firstInput.focus();
        }
      }
      if (index > 0 && prevInput) {
        currentInput.value = '';
        const prevIndex = index ;
        const prevInput = document.getElementById(`otp${prevIndex}`);
        if (prevInput) {
          // Check if prevInput is not null before focusing
          prevInput.focus(); // Move focus to the previous input
        }
      } else {
        currentInput.value = '';
      }
    } else {
     if (nextInput && nextInput.hasAttribute('disabled') && currentInput.value !== '') {
        nextInput.removeAttribute('disabled');
        nextInput.focus();
      }
    }
  
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = currentInput.value;
    setOtpInputs(newOtpInputs);
  
    const isOtpComplete = newOtpInputs.every((input) => input !== '');
    const isValidOtp = isOtpComplete && newOtpInputs.every((input) => /^\d$/.test(input));
  
    // Update button visibility based on OTP validity
    if (sendOtpButtonRef.current && sendOtpButtonRef.current.style) {
      sendOtpButtonRef.current.style.display = isValidOtp ? 'none' : 'inline-block';
    }
  
    if (verifyOtpButtonRef.current && verifyOtpButtonRef.current.style) {
      verifyOtpButtonRef.current.style.display = isValidOtp ? 'inline-block' : 'none';
    }
  };
  
  
  
  
  

  useEffect(() => {
    // Ensure that sendOtpButtonRef and verifyOtpButtonRef are not null
    if (sendOtpButtonRef.current && verifyOtpButtonRef.current) {
      document.getElementById('otp1').focus();
    }
  }, [sendOtpButtonRef, verifyOtpButtonRef]);

  //functions to make contact with backend and redirection
  function handleForm(event) { //loginform
    event.preventDefault();
  
    let userData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };
  
    // Update the URL to match your server's URL (http://localhost:5000/login)
    fetch("http://localhost:5000/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
  
        if (data.success) {
          // Redirect to the home page
          setUserId(data.userId);
          handleLoginStatus(true);
          navigate('/chatbot');
        } else {
          // Handle other responses or errors
          console.error(data.message);
          setLoginError(true);
        }
      })
      .catch(error => {
        console.error("Error during login:", error);
        setLoginError(true);
      });
  }
  

  function handleSignupForm(event) {
    event.preventDefault();
  
    
    let userData = {
      name: event.target.name.value,
      email: event.target.email.value,
      password: event.target.password.value,
      phoneNumber: phoneNumber,
    };
  
    // Update the URL to match your server's signup route (http://localhost:5000/signup)
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.text())
      .then(data => {
        try {
          const responseData = JSON.parse(data);
          console.log("Response from server:", responseData);
          console.log("Type of data:", typeof responseData);
          if (responseData.success) {
            // Redirect to the home page
            handleLoginStatus(true);
            navigate('/chatbot', { state: { userId2: responseData.userId } });
          } else {
            // Handle other responses or errors
            console.error(responseData.message);
            setLoginError(true);
          }
        } catch (error) {
          console.error("Error parsing response data:", error);
          setLoginError(true);
        }
      })      
      .catch(error => {
        console.error('Error during signup:', error);
        setLoginError(true);
        // Handle the error (e.g., show an error message)
      });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    // Add any additional conditions to determine whether the form should be submitted
    if (e.nativeEvent.submitter.id === 'signupbutton') {
      handleSignupForm(e); // Call the signup form submission function
    }
  };
  
  
  return (
    <>
    <div className="go-back-container">
        <div className='go-back'>
          <p>Go Back</p>
        </div>
        <NavLink to="/">
            <img src="/Logo.png" alt="Logo" />
        </NavLink>
      </div>
    <div className="container" id="container">
      <CombineLogo/>
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmit}>
          <h1>Create Account</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fa fa-facebook"></i></a>
            <a href="#" className="social"><i className="fa fa-google"></i></a>
            <a href="#" className="social"><i className="fa fa-linkedin"></i></a>
          </div>
          <span>or use your email for registration</span>
          <input type="text" name="name" placeholder="Name" />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onBlur={(e) => {
              const isValid = validateIndianPhoneNumber(e.target.value);
              setPhoneNumberValidation(isValid ? 'valid' : 'invalid');
            }}
          />
          {phoneNumberValidation  === 'invalid' && (
            <div>
            <p style={errorStyle}>Invalid Phone Number format</p>
            </div>
          )}
          {phoneNumberValidation  === 'valid' && (
            <div>
            {/* <Good/> */}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onBlur={(e) => {
              const isValid = validateEmail(e.target.value);
              setEmailValidation(isValid ? 'valid' : 'invalid');
            }}
          />
          {emailValidation === 'invalid' && (
            <div>
            <p style={errorStyle}>Invalid email format</p>
            {/* <Email_Validations/> */}
            </div>
          )}
          {emailValidation === 'valid' && (
            <div>
            {/* <Good/> */}
            </div>
          )}


          <input
            type="password"
            name="password"
            placeholder="Password"
            onBlur={(e) => {
              const isValid = validatePassword(e.target.value);
              setPasswordValidation(isValid ? 'valid' : 'invalid');
            }}
          />
          {passwordValidation === 'invalid' && (
            <div>
              <p style={errorStyle}>Password must be at least 8 characters long</p>
              {/* <Password_Validations/> */}
            </div>
          )}
          {passwordValidation === 'valid' && (
            <div>
              {/* <Good/> */}
            </div>
          )}
          <div className="otp-field">
          {Array.from({ length: 4 }, (_, i) => (
            <input
              type="number"
              key={i}
              id={`otp${i + 1}`}
              value={otpInputs[i]}
              onChange={(e) => handleOtpInputChange(i, e.target.value)}
              onKeyUp={(e) => handleOtpInputKeyUp(e, i)}
              disabled={i !== 0}
            />
          ))}
          
        </div>
        <button id="sendOtpButton" onClick={handleSendOtp}>Send OTP</button>
          {showVerifyButton && (
            <button id="verifyOtpButton" onClick={handleVerifyOtp}>Verify OTP</button>
          )}
          {/* Conditionally render the signup button based on the OTP verification status */}
          {showSignUpButton  && (
            <button
            id="signupbutton"
            className="get-started-button"
          >
              <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
              </svg>
              <span>SignUp</span>
            </button>
          )}
        </form>
      </div>

      <div className="form-container sign-in-container">
        <form onSubmit={handleForm}>
          <h1>Log In</h1>
          <div className="social-container">
            <a href="#" className="social"><i className="fa fa-facebook"></i></a>
            <a href="#" className="social"><i className="fa fa-google"></i></a>
            <a href="#" className="social"><i className="fa fa-linkedin"></i></a>
          </div>
          {loginError && (
            <div>
            <p style={errorStyle}>Login failed. Please check your credentials.</p>
            {/* <User_Not_Found/> */}
         </div>
          )}
          
          <span>or use your account</span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            onBlur={(e) => {
              const isValid = validateEmail(e.target.value);
              setEmailValidation(isValid ? 'valid' : 'invalid');
            }}
          />
          {emailValidation === 'invalid' && (
            <div>
            <p style={errorStyle}>Invalid email format</p>
            {/* <Email_Validations/> */}
            </div>
          )}
          {emailValidation === 'valid' && (
            <div>
            {/* <Good/> */}
            </div>
          )}


          <input
            type="password"
            name="password"
            placeholder="Password"
            onBlur={(e) => {
              const isValid = validatePassword(e.target.value);
              setPasswordValidation(isValid ? 'valid' : 'invalid');
            }}
          />
          {passwordValidation === 'invalid' && (
            <div>
              <p style={errorStyle}>Password must be at least 8 characters long</p>
              {/* <Password_Validations/> */}
            </div>
          )}
          {passwordValidation === 'valid' && (
            <div>
              {/* <Good/> */}
            </div>
          )}


          <Link to="/forgotpage">Forgot Your Password</Link>
          <button className="get-started-button">
            <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
              <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
            </svg><span>Log In</span>
          </button>
        </form>
      </div>

      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button id="signIn" className="get-started-button">
              <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
              </svg><span>Log In</span>
            </button>
          </div>

          <div className="overlay-panel overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Enter your details and start journey with us</p>
            <button id="signUp" className="get-started-button">
              <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
              </svg><span>SignUp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;