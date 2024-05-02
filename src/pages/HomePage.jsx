import React from 'react';
import { Link } from 'react-router-dom';
import "./../css/HomePage.css";
import "./../css/font.css"; // Assuming this file contains the font styles
import "./AboutPage"; 

function HomePage() {
  return (
    <div className='Maindiv'>
      <header>
        <h1 className="oleo-script-regular">AK Digitals</h1> {/* Apply oleo-script-regular class */}
        
        <div className='header-links'>
          <Link to='/AboutPage' className='header-link'>About</Link>
          <Link to='/AboutPage' className='header-link'>Contact</Link>
        </div>
      </header>
      <p className="teko-heading">HELLO! WELCOME TO AK PHOTOGRAPHY GALLERY WITH CREATIVE AND UNIQUE STYLE</p>
   <div className='photo-container'>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    <img src='/assets/logo.jpg'/>
    
   </div>
    </div>
  );
}

export default HomePage;
