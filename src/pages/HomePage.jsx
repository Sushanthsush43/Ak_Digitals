import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';
import "./ContactPage"
import '../components/PhotoUpload';
import PhotoVideoTab from '../components/PhotoVideoTab';
import DeletePhotos from '../components/DeletePhotos';
import { getFirebaseConfig } from '../components/uitls/firebaseConfig';
import AdminLoginForm from '../components/AdminLoginForm';
import Header from '../components/Header';
import VideoUpload from '../components/VideoUpload';
import PhotoUpload from '../components/PhotoUpload';

function HomePage() {

  // Firebase stuff ( Important )
  const { storage, app } = getFirebaseConfig();

  const [showHoverText, setShowHoverText] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowHoverText(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div className='Main-div'>

      <div className='header-div'>
        <Header />
      </div>
      
      <div className='homePage-textBox'>
        <p className={`hoverText ${showHoverText ? 'show' : ''}`}>
          <h4>WE CAPTURE THE MOMENTS</h4>
          <ul style={{ listStyleType: 'none', padding: '' }}>
            <li>Trust us to capture the magic of your life's journey, one frame at a time, freezing fleeting
             moments into extraordinary memories with our passion and keen eye for detail.</li>
          </ul>
        </p>
      </div>
      
      {/* <VideoContainer /> */}
      {/* <AdminLoginForm app={app}/> */}
      <PhotoVideoTab storage={storage}/>
      {/* <DeletePhotos storage={storage}/> */}
      {/* <DeleteVideos storage={storage}/> */}
      {/* <PhotoUpload storage={storage} app={app}/> */}
      {/* <VideoUpload storage={storage}/> */}
    </div>
  );
}

export default HomePage;
