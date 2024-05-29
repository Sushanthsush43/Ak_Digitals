import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLoginForm from './AdminLoginForm';
import { CheckAdminLogin } from './uitls/checkAdminLogin';
import AdminLogout from './AdminLogout';
import { IoClose } from "react-icons/io5";

const Header = ({app}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [close, setClose] = useState(true);
  const { isAdminLoggedIn } = CheckAdminLogin({ app, getBool : true});

  const handleSignUpClick = () => {
    setIsVisible(!isVisible);
  };

  const closeSignIN = () => {
    setIsVisible(false)
  }
  
  const handleClose = (status) => {
    setClose(status);
  };

  useEffect(()=>{
    setIsVisible(!close); // reverse the close variable ( needed )
  },[close]);

  return (
    <div>
      <div className={`header-Main`}>
        <div className="heading-container" onClick={handleSignUpClick}>
          <h1 className="sofia-regular header-gradient-text">AK DIGITALS</h1>
        </div>
        
        <div className='header-links'>
          { isAdminLoggedIn &&
            <Link to='/dashboard' className="teko-headings">DASHBOARD</Link>
          }
          <Link to='/contactpage' className="teko-headings">CONTACT</Link>
        </div>
      </div>
      <div className={`signIn ${isVisible ? 'visible' : ''}`}>
        <div className='close-div'>
        
          <IoClose className='close-SignIn' onClick={closeSignIN}/>
        </div>
        <div className='Login-logout-div'>
          { isAdminLoggedIn ?
                <AdminLogout app={app} closeStatus={handleClose}/> 
              :
                <AdminLoginForm app={app}  closeStatus={handleClose}/>
          }
        </div>
      </div>
    </div>
  );
};

export default Header;
