import './App.css';
import { useNavigate } from "react-router-dom";
import React , { Component}  from 'react';


function App() {

  const navigate = useNavigate ();
 
    const loginPage = () => {
        navigate('/loginpage')
    }

  return (
    <>  
    <div className="content-container">
      {/* Your existing content excluding the footer */}
      <div className="logo-container">
        <img src="/Logo.png" alt="Logo" />
      </div>
      <div className="website-name-container">
        <h1>ScriptSage</h1>
      </div>

      {/* Navigation bar with links */}
      <nav>
        <a>About us</a>
        <a>Collaboration</a>
        <a>Download</a>
        <a>FAQ</a>
      </nav>

      <div id="Login"> 
        <button className="login-button" onClick={loginPage}>
          <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
            <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
            <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
          </svg><span>Login</span>
        </button>
        <button className="get-started-button" onClick={loginPage}>
          <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
            <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
            <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
          </svg><span>Get Started</span>
        </button>
      </div>

      <div id="Image1">
        <img src="/vecteezy_abstract-3d-human-head-made-of-colorful-paint-splashes_23176611.jpg" alt="Robo Image" />
      </div>

      <div id="PoweredBY">
        <p>Powered by GPT AI</p>
      </div>

      <div id="maintext">
        <p>Interactive Coding with ChatBot AI Language model.</p>
      </div>
      <div id="subtext">
        <p>
          <b>ScriptSage</b> is a language model based on powerful <b>Artificial Intelligence</b>, you can generate accurate
          and excellent output through it.
        </p>
      </div>
      <div id="Email">
        <input type="email" placeholder="Enter Your Email address" />
      </div>
      {/* Your website content goes here */}
      <div id="getstart">
        <button className="get-started-button" onClick={loginPage}>
          <svg width="180px" height="60px" viewBox="0 0 180 60" className="border">
            <polyline points="179,1 179,59 1,59 1,1 179,1" className="bg-line" />
            <polyline points="179,1 179,59 1,59 1,1 179,1" className="hl-line" />
          </svg><span>Get Started</span>
        </button>
      </div>
    </div>

    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <h2 style={{ backgroundColor: '#23262F' }}>Contact Us</h2>
          <p style={{ backgroundColor: '#23262F' }}>Email: agdhonde@gmail.com</p>
          <p style={{ backgroundColor: '#23262F' }}>Phone: 8605330141</p>
        </div>
        <div className="footer-section">
          <h2 style={{ backgroundColor: '#23262F' }}>Follow Us</h2>
          <a  style={{ backgroundColor: '#23262F', textDecoration: 'none' }}><i className="fab fa-linkedin"></i> LinkedIn</a>
          <a  style={{ backgroundColor: '#23262F', textDecoration: 'none' }}><i className="fa-brands fa-facebook"></i>Facebook</a>
          <a  style={{ backgroundColor: '#23262F', textDecoration: 'none' }}><i className="fab fa-instagram"></i> Instagram</a>
        </div>
        <div className="footer-section">
          <h2 style={{ backgroundColor: '#23262F' }}>Address</h2>
          <p style={{ backgroundColor: '#23262F' }}>Charholi Bk, Pune</p>
          <p style={{ backgroundColor: '#23262F' }}>India, 412105</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p style={{ backgroundColor: '#23262F' }}>&copy; 2023 ScriptSage. All rights reserved.</p>
      </div>
    </footer>
    
  </>
  );
}

export default App;
