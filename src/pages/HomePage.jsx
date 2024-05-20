import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';
import "./ContactPage"
import { getFirebaseConfig } from '../components/uitls/firebaseConfig';
import Header from '../components/Header';
import TabsComponent from '../components/TabsComponent';
import PhotoContainer from '../components/PhotoContainer';
import VideoContainer from '../components/VideoContainer';
import DeletePhotos from '../components/DeletePhotos';
import DeleteVideos from '../components/DeleteVideos';
import AboutUs from '../components/AboutUs';

// Firebase stuff ( Important )
const { storage, app } = getFirebaseConfig();

function HomePage() {

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
        <Header app={app}/>
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
      {/* <TabsComponent storage={storage} Tab1={PhotoContainer} Tab2={VideoContainer}/> */}
      {/* <DeletePhotos storage={storage}/> */}
      <DeleteVideos storage={storage}/>
      {/* <AboutUs /> */}
      {/* <PhotoUpload storage={storage} app={app}/> */}
      {/* <VideoUpload storage={storage}/> */}
    </div>
  );
}

export default HomePage;
