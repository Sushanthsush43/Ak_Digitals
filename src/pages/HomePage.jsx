import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';
import "./ContactPage"
import '../components/PhotoUpload';
import PhotoVideoTab from '../components/PhotoVideoTab';
import DeletePhotos from '../components/DeletePhotos';
import DeleteVideos from '../components/DeleteVideos';
import PhotoUpload from '../components/PhotoUpload';
import VideoUpload from '../components/VideoUpload';
import { getFirebaseConfig } from '../components/uitls/firebaseConfig';
import AdminLoginForm from '../components/AdminLoginForm';
import Header from '../components/Header';

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
    <div className={`Maindiv`}>
      <Header />

      <div className='home-text-main'>
        <p className={`hoverText ${showHoverText ? 'show' : ''}`}>
          <h4 style={{ textAlign: 'center' }}>WE CAPTURE THE MOMENTS</h4>
          <ul style={{ listStyleType: 'none', padding: '' }}>
            <li>Trust us to capture the magic of your life's journey, one frame at a time, freezing fleeting
              moments into extraordinary memories with our passion and keen eye for detail.</li>
          </ul>
        </p>
      </div>

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
