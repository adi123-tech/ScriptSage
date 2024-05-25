import React from 'react';
import "../LoginPage/login.css";
import axios from 'axios';
import CombineLogo from '../CombineLogoPage/CombineLogo';
import { NavLink } from 'react-router-dom';


class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      newpassword: '',
      retypepassword: '',
      emailStatus: '',
      passwordStatus: '',
      retypePasswordStatus: '',
      emailErrorMessage: '',
      passwordErrorMessage: '',
      retypePasswordErrorMessage: '',
      message: '',
      emailValidationNeeded: false,
      newpasswordValidationNeeded: false,
      otpInputs: Array(4).fill(''),
      otpVerified: false,
      showVerifyButton: false,
      showSignUpButton: false,
      otpSent: '',
      setOtpInputs: (value) => this.setState({ otpInputs: value }),
      setOtpSent: (value) => this.setState({ otpSent: value }),
      setShowVerifyButton: (value) => this.setState({ showVerifyButton: value }),
      setShowSignUpButton: (value) => this.setState({ showSignUpButton: value }),
      setOtpVerified: (value) => this.setState({ otpVerified: value }),
      emailNotFound: false,
    };

    this.sendOtpButtonRef = React.createRef();
    this.verifyOtpButtonRef = React.createRef();
  }

  validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  validatePassword = (password) => {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+]).{8,}$/;
    return passwordRegex.test(password);
  };

  validatePasswordsMatch = (password, retypePassword) => {
    return password === retypePassword;
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Validate password when input changes
    if (name === 'newpassword') {
      console.log(this.validatePassword(value)); // Check the output in the console
    }
  
    this.setState({
      [name]: value,
      [`${name}Status`]: 'good',
      [`${name}ErrorMessage`]: '',
    });
  };
  

  handleInputBlur = (name) => {
    const value = this.state[name];
    const isValid = this.validateInput(name, value);
  
    console.log(name, value, isValid, this.state[`${name}Status`], this.state[`${name}ErrorMessage`]);
  
    this.setState({
      [`${name}Status`]: isValid ? 'good' : 'bad',
      [`${name}ErrorMessage`]: isValid ? '' : this.getErrorMessage(name),
      // Enable email or password validation if the input is not valid
      emailValidationNeeded: name === 'email' && !isValid,
      newpasswordValidationNeeded: name === 'newpassword' && !isValid,
    }, () => {
      // Use the callback to ensure state is updated before checking for the error message
      if (name === 'newpassword') {
        console.log(this.state[`${name}ErrorMessage`]); // Check the output in the console
      }
    });
  };
  
  getErrorMessageDisplay = (name) => {
    const errorMessage = this.state[`${name}ErrorMessage`];
    return errorMessage ? <div style={{ color: 'red' }}>{errorMessage}</div> : null;
  };
  
  
  

  validateInput = (name, value) => {
    switch (name) {
      case 'email':
        return this.validateEmail(value);
      case 'newpassword':
        return this.validatePassword(value);
      case 'retypepassword':
        return this.validatePasswordsMatch(this.state.newpassword, value);
      default:
        return true;
    }
  };

  getErrorMessage = (name) => {
    switch (name) {
      case 'email':
        return 'Invalid email format';
      case 'newpassword':
        return 'Password must contain at least 8 characters';
      case 'retypepassword':
        return 'Passwords do not match';
      default:
        return '';
    }
  };

  handleForgotPassForm = async (event) => {
    event.preventDefault();
  
    const { email, newpassword, retypepassword } = this.state;
  
    if (!this.validateEmail(email) || !this.validatePassword(newpassword) || !this.validatePasswordsMatch(newpassword, retypepassword)) {
      this.setState({
        message: 'Validation failed. Please check your inputs.',
      });
      return;
    }
  
    let userData = {
      email,
      newpassword,
    };
  
    try {
      // Reset emailNotFound to false before making the API call
      this.setState({ emailNotFound: false });
  
      const response = await fetch("http://localhost:5000/forgotpass", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      const data = await response.text();
  
      try {
        const jsonData = JSON.parse(data);
        console.log(jsonData);
  
        if (jsonData.success) {
          window.location.href = '/';
        } else {
          console.error(jsonData.message);
          this.setState({ emailNotFound: true });
        }
      } catch (error) {
        // Handle the error if the response is not valid JSON
        console.error("Error parsing JSON:", error);
        this.setState({ emailNotFound: true });
      }
    } catch (error) {
      console.error("Error during login:", error);
      this.setState({ emailNotFound: true });
    }
  };
  
  

  handleOtpInputChange = (index, value) => {
    const { otpInputs } = this.state;
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = value;
    this.setState({ otpInputs: newOtpInputs });
  };

  handleOtpInputKeyUp = (e, index) => {
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
  
    const newOtpInputs = [...this.state.otpInputs];
    newOtpInputs[index] = currentInput.value;
    this.setState({ otpInputs: newOtpInputs });
  
    const isOtpComplete = newOtpInputs.every((input) => input !== '');
    const isValidOtp = isOtpComplete && newOtpInputs.every((input) => /^\d$/.test(input));
  
    // Update button visibility based on OTP validity
    if (this.sendOtpButtonRef.current && this.sendOtpButtonRef.current.style) {
      this.sendOtpButtonRef.current.style.display = isValidOtp ? 'none' : 'inline-block';
    }

    if (this.verifyOtpButtonRef.current && this.verifyOtpButtonRef.current.style) {
      this.verifyOtpButtonRef.current.style.display = isValidOtp ? 'inline-block' : 'none';
    }
  };

  handleSendOtp = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/send-otp', {
        to: '+918605330141',
      });
  
      if (response.data.success) {
        console.log('OTP sent successfully:', response.data.otp);
        this.setState({ otpSent: response.data.otp });
        this.setState({ showVerifyButton: true });
        this.setState({ showSignUpButton: false });
        this.setState({ otpVerified: false });
  
        if (this.sendOtpButtonRef.current) {
          this.sendOtpButtonRef.current.clicked = true;
        }
      } else {
        console.error('Failed to send OTP:', response.data.message);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  handleVerifyOtp = (e) => {
    e.preventDefault();
    try {
      const { otpInputs, otpSent } = this.state;
      const enteredOtp = otpInputs.map(Number).join('');
      const enteredOtpNumber = parseInt(enteredOtp, 10);
      const storedOtp = parseInt(otpSent, 10);
  
      // Directly compare the entered OTP with the stored OTP
      const isOtpValid = this.verifyOtpFunction(storedOtp, enteredOtpNumber);

      if (isOtpValid) {
        this.setState({ otpVerified: true });
        this.setState({ showVerifyButton: false });
        this.setState({ showSignUpButton: true });
      } else {
        console.error('Invalid OTP');
        this.setState({ otpInputs: Array(4).fill('') });
        // Add any other logic or UI update for an invalid OTP
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      // Handle the error, if any
    }
  };

  verifyOtpFunction = (userEnteredOtp, sentOtp) => {
    // Compare userEnteredOtp with the stored OTP
    // Return true if the OTP is valid, false otherwise
    return userEnteredOtp === sentOtp;
  };

  

  render() {
    const {emailNotFound, emailStatus, passwordStatus, retypePasswordStatus, emailErrorMessage, passwordErrorMessage, retypePasswordErrorMessage, message, emailValidationNeeded, newpasswordValidationNeeded, otpInputs, showVerifyButton,showSignUpButton } = this.state;
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
        <div className="form-container sign-in-container">
          <form onSubmit={this.handleForgotPassForm}>
            {emailValidationNeeded}
            {!emailValidationNeeded}
            {newpasswordValidationNeeded }
            {!newpasswordValidationNeeded}
            {emailNotFound}
            {!emailNotFound}
            <h1>Reset Password</h1>
            <span>Enter your email and new password</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={this.handleInputChange}
              onBlur={() => this.handleInputBlur('email')}
              className={emailStatus}
              required
            />
            {emailErrorMessage && <div style={{ color: 'red' }}>{emailErrorMessage}</div>}
            
            <input
              type="password"
              name="newpassword"
              placeholder="New Password"
              onChange={this.handleInputChange}
              onBlur={() => this.handleInputBlur('newpassword')}
              className={passwordStatus}
              required
            />
            {this.getErrorMessageDisplay('newpassword')}
            <input
              type="password"
              name="retypepassword"
              placeholder="Retype Password"
              onChange={this.handleInputChange}
              onBlur={() => this.handleInputBlur('retypepassword')}
              className={retypePasswordStatus}
              required
            />
            {this.getErrorMessageDisplay('retypepassword')}
            <div id="message" style={{ color: 'red' }}>
              {message}
            </div>
            <div className="otp-field">
              {otpInputs.map((value, index) => (
                <input
                  type="number"
                  key={index}
                  id={`otp${index + 1}`}
                  value={value}
                  onChange={(e) => this.handleOtpInputChange(index, e.target.value)}
                  onKeyUp={(e) => this.handleOtpInputKeyUp(e, index)}
                  disabled={index !== 0}
                />
              ))}
            </div>
            <button id="sendOtpButton" onClick={this.handleSendOtp} ref={this.sendOtpButtonRef}>Send OTP</button>
            {showVerifyButton && (
              <button id="verifyOtpButton" onClick={this.handleVerifyOtp} ref={this.verifyOtpButtonRef}>Verify OTP</button>
            )}
            {showSignUpButton  && (
            <button
            id="signupbutton"
            className="get-started-button"
          >
              <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
                <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
              </svg>
              <span>Reset</span>
            </button>
          )}
          
          </form>
        </div>
        <img src="/Forgot.jpg" id="img-forgot"/>
       <img src="/Forgot2-removebg.png" id="img-forgot-2"/>
      </div>
      </>
    );
  }
}

export default Forgot;
