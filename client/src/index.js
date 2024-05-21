import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/LoginPage/Login';
import Forgot from './Pages/ForgotPassPage/Forgot';
import Chatbot from './Pages/MainPage/Chatbot Pages/Chatbot/Chatbot';
import Compiler from './Pages/MainPage/Chatbot Pages/Compiler/Compiler';
import Quiz from './Pages/MainPage/Chatbot Pages/Quiz/Quiz';
import Settings from './Pages/MainPage/Chatbot Pages/Settings/Settings';
import Tutorials from './Pages/MainPage/Chatbot Pages/Tutorial/Tutorials';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';
import { UserProvider } from './UserContext';

function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // Function to update login status
  const handleLoginStatus = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status ? 'true' : 'false');
  };

  useEffect(() => {
    // Check if the user was logged in before
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/loginpage" element={<Login handleLoginStatus={handleLoginStatus} />} />
            <Route path="/forgotpage" element={<Forgot />} />
            <Route path="/not_found_page" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
            {/* PrivateRoute logic inline */}
            <Route
              path="/chatbot"
              element={
                isLoggedIn ? (
                  <Chatbot />
                ) : (
                  <Navigate to={{ pathname: '/not_found_page', state: { from: '/chatbot' } }} />
                )
              }
            />
            <Route
              path="/compiler"
              element={
                isLoggedIn ? (
                  <Compiler />
                ) : (
                  <Navigate to={{ pathname: '/not_found_page', state: { from: '/compiler' } }} />
                )
              }
            />
            <Route
              path="/quiz"
              element={
                isLoggedIn ? (
                  <Quiz />
                ) : (
                  <Navigate to={{ pathname: '/not_found_page', state: { from: '/quiz' } }} />
                )
              }
            />
            <Route
              path="/tutorials"
              element={
                isLoggedIn ? (
                  <Tutorials />
                ) : (
                  <Navigate to={{ pathname: '/not_found_page', state: { from: '/tutorials' } }} />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isLoggedIn ? (
                  <Settings />
                ) : (
                  <Navigate to={{ pathname: '/not_found_page', state: { from: '/settings' } }} />
                )
              }
            />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Index />);
reportWebVitals();
