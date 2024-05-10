import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GrInstagram } from "react-icons/gr";
import '../css/HomePage.css';
import "./ContactPage"
import '../components/PhotoUpload';
import PhotoVideoTab from '../components/PhotoVideoTab';

function HomePage() {

  const [showHoverText, setShowHoverText] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowHoverText(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`Maindiv`}>
      <header>
        <div className="heading-container">
          <h1 className="sofia-regular">sushanth sherigar</h1>
        </div>

        <div className='header-links'>
          <Link to='/ContactPage' className="teko-headings">CONTACT</Link>
        </div>
      </header>

      <p className={`hoverText ${showHoverText ? 'show' : ''}`}>
        <h4 style={{ textAlign: 'center' }}>WE CAPTURE THE MOMENTS</h4>
        <ul style={{ listStyleType: 'none', padding: '' }}>
          <li>Trust us to capture the magic of your life's journey, one frame at a time, freezing fleeting
            moments into extraordinary memories with our passion and keen eye for detail.</li>
        </ul>
      </p>
      <PhotoVideoTab/>
      {/* <PhotoContainer /> */}
      {/* <VideoContainer /> */}
    </div>
  );
}

export default HomePage;
