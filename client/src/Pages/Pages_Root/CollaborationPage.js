// CollaborationPage.js
import React from 'react';
import { NavLink } from 'react-router-dom';

function CollaborationPage() {
  return (
    <div>
      <div className="go-back-container">
      <div className='go-back'>
          <p>Go Back</p>
        </div>
      <NavLink to="/">
          <img src="/Logo.png" alt="Logo" />
        </NavLink>
      </div>
      <h2>Collaboration</h2>
      <p>This is the Collaboration page content.</p>
    </div>
  );
}

export default CollaborationPage;

