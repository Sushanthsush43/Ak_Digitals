import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GrInstagram } from "react-icons/gr";
import '../css/HomePage.css';
import "../css/Delete.css";
import "./ContactPage"
import '../components/PhotoUpload';
import VideoUpload from '../components/VideoUpload';
import DeleteVideos from '../components/DeleteVideos';
import DeletePhotos from '../components/DeletePhotos';
import PhotoContainer from '../components/PhotoContainer';
import VideoContainer from '../components/VideoContainer';
import Testing from '../components/Testing';
import PhotoUpload from '../components/PhotoUpload';

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
          <h1 className="sofia-regular">AK DIGITALS</h1>
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

      {/* <PhotoContainer /> */}
      <VideoContainer />
      {/* <PhotoUpload /> */}
      {/* <VideoUpload /> */}
      {/* <DeletePhotos /> */}
      {/* <DeleteVideos /> */}
    </div>
  );
}

export default HomePage;
