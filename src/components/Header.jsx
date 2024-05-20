import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLoginForm from './AdminLoginForm';
import { CheckAdminLogin } from './uitls/checkAdminLogin';
import AdminLogout from './AdminLogout';

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
      <div className='header-Main'>
        <div className="heading-container" onClick={handleSignUpClick}>
          <h1 className="sofia-regular">AK DIGITALS</h1>
        </div>
        
        <div className='header-links'>
          { isAdminLoggedIn &&
            <Link to='/dashboard' className="teko-headings">DASHBOARD</Link>
          }
          <Link to='/contactpage' className="teko-headings">CONTACT</Link>
        </div>
      </div>
      <div className={`signIn ${isVisible ? 'visible' : ''}`}>
          <button className='close-SignIn' onClick={closeSignIN}>X</button>

          { isAdminLoggedIn ?
                <AdminLogout app={app} closeStatus={handleClose}/> 
              :
                <AdminLoginForm app={app}  closeStatus={handleClose}/>
          }
      </div>
    </div>
  );
};

export default Header;
