// FAQPage.js
import React from 'react';
import { NavLink } from 'react-router-dom';

function FAQPage() {
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
      <h2>FAQ</h2>
      <p>This is the FAQ page content.</p>
    </div>
  );
}

export default FAQPage;
