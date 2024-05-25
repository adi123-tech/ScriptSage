import React from 'react';
import './notfoundpage.css';
import CombineLogo from '../CombineLogoPage/CombineLogo';
import { NavLink } from 'react-router-dom';


function NotFoundPage() {
  return (
    <>
    <div className="logo-container">
        <div className='go-back'>
          <p>Go Back</p>
        </div>
        <NavLink to="/">
            <img src="/Logo.png" alt="Logo" />
        </NavLink>
      </div>
    <CombineLogo/>
    <div className='notfound-container'>
      <img src="/404.png" alt=""/>
    </div>
    </>
    
  );
}

export default NotFoundPage;
