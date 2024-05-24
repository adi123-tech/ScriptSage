// AboutUsPage.js
import React from 'react';
import { NavLink } from 'react-router-dom';

function AboutUsPage() {
  return (
    <div>
      <div className="logo-container">
        <div className='go-back'>
          <p>Go Back</p>
        </div>
        <NavLink to="/">
            <img src="/Logo.png" alt="Logo" />
        </NavLink>
      </div>
      <h2>About Us</h2>
      <p>This is the About Us page content.</p>
    </div>
  );
}

export default AboutUsPage;
