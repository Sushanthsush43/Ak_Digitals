import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLoginForm from './AdminLoginForm';
import { CheckAdminLogin } from './uitls/checkAdminLogin';
import AdminLogout from './AdminLogout';
import { IoClose } from "react-icons/io5";

const Header = ({ app }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { isAdminLoggedIn } = CheckAdminLogin({ app, getBool: true });

  const handleSignUpClick = () => {
    setIsTransitioning(true);
    setIsVisible(true);
  };

  const closeSignIN = () => {
    setIsTransitioning(true);
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // This should match the transition duration in your CSS
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // This should match the transition duration in your CSS
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    <div>
      <div className="header-Main">
        <div className="heading-container" onClick={handleSignUpClick}>
          <h1 className="sofia-regular header-gradient-text">AK DIGITALS</h1>
        </div>

        <div className="header-links">
          {isAdminLoggedIn &&
            <Link to='/dashboard' className="teko-headings dashboard-link">DASHBOARD</Link>
          }
          <Link to='/contactpage' className="teko-headings contact-link">CONTACT</Link>
        </div>
      </div>
      <div className={`signIn ${isTransitioning ? 'transitioning' : ''} ${isVisible ? 'visible' : ''}`}>
        <div className='close-div'>
          <IoClose className='close-SignIn' onClick={closeSignIN} />
        </div>
        <div className='Login-logout-div'>
          {isAdminLoggedIn ?
            <AdminLogout app={app} closeStatus={closeSignIN} />
            :
            <AdminLoginForm app={app} closeStatus={closeSignIN} />
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
