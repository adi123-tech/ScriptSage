import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import { useUser } from '../../../../UserContext';
import { useNavigate } from 'react-router-dom';
import './settings.css';
import axios from 'axios'; // Import Axios for making HTTP requests
import CombineLogo from '../../../CombineLogoPage/CombineLogo';
function Settings() {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  useEffect(() => {
    // Function to fetch user data from the backend
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user-details/${userId}`); // Assuming your backend endpoint is /api/user/:userId
        setUserData(response.data); // Set the user data in state
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    // Call the fetchUserData function when the component mounts
    fetchUserData();
  }, [userId]); // Call the effect whenever userId changes

  // Function to handle chat clearing
  const handleClearChat = async () => {
    const confirmed = window.confirm('Are you sure you want to clear the chat?'); // Display confirmation prompt
    if (confirmed) {
      try {
        // Make HTTP request to clear the chat for the current user
        await axios.delete(`/clear-chat/${userId}`);
        console.log('Chat cleared!');
        // Optionally, you can update the UI or show a success message here
      } catch (error) {
        console.error('Error clearing chat:', error);
        // Optionally, you can update the UI or show an error message here
      }
    }
  };

  // Function to handle account deletion
  const handleDeleteAccount = async () => {
    const password = prompt('Please enter your password to confirm account deletion:');
    if (password) {
      try {
        // Make HTTP request to delete the user account with password verification
        await axios.delete(`/delete-account/${userId}`, { data: { password } });
        console.log('Account deleted!');
        navigate('/');
        // Optionally, you can redirect the user or show a success message here
      } catch (error) {
        console.error('Error deleting account:', error);
        // Display an alert if the password is incorrect
        if (error.response && error.response.status === 401) {
          alert('Incorrect password. Please try again.');
        } else {
          // Optionally, you can update the UI or show an error message here for other types of errors
        }
      }
    }
  };

  // Render loading state while user data is being fetched
  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  // Destructure user data
  const { name, phoneNumber, email } = userData;

  return (
    <div className="settings-container">
      <CombineLogo />
      <Navbar />
      <img className='settings-img' src="/settings.png" alt="" />
      <p className='user-id-settings'>User ID: {userId}</p>
      <div className="settings-buttons">
        <button className={`circle-button ${profileOpen ? 'profile-open' : ''}`} onClick={toggleProfile}>
          <img src="/profile.png" className="profile-image" alt="Profile 1" />
          <p> View Profile</p>
        </button>
        <button className="circle-button" onClick={handleClearChat}>
          <img src="/clear.png" className="profile-image" alt="Profile 1" />
          <p>Clear Chat</p>
        </button>
        <button className="circle-button delete-button" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

      <div className={`profile-section ${profileOpen ? 'open' : ''}`}>
        <div className="profile-info">
          <img src="https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg" className='profile-image' alt="" />
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Phone Number:</strong> {phoneNumber}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
