import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLoginForm from './AdminLoginForm';

const Header = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSignUpClick = () => {
    setIsVisible(!isVisible);
  };

  const closeSignIN = () => {
    setIsVisible(false)
  }

  return (
    <div>
      <div className='header-Main'>
        <div className="heading-container" onClick={handleSignUpClick}>
          <h1 className="sofia-regular">AK DIGITALS</h1>
        </div>

        <div className='header-links'>
          <Link to='/ContactPage' className="teko-headings">CONTACT</Link>
        </div>
      </div>
      <div className={`signIn ${isVisible ? 'visible' : ''}`}>
          <button className='close-SignIn' onClick={closeSignIN}>X</button>
          <AdminLoginForm />
      </div>
    </div>
  );
};

export default Header;
