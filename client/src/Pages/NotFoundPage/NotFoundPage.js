import React, { useEffect } from 'react';
import './notfoundpage.css';
import CombineLogo from '../CombineLogoPage/CombineLogo';

function NotFoundPage() {
  return (
    <>
    <CombineLogo/>
    <div className='notfound-container'>
      <img src="/404.png" alt=""/>
    </div>
    </>
    
  );
}

export default NotFoundPage;
