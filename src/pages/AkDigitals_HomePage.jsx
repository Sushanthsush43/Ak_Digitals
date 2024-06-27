import React, { useState, useEffect } from 'react';
import '../css/HomePage.css';
import Header from '../components/AkDigitals_Header';
import TabsComponent from '../components/AkDigitals_TabsComponent';
import PhotoContainer from '../components/AkDigitals_PhotoContainer';
import VideoContainer from '../components/AkDigitals_VideoContainer';

function HomePage({storage, app}) {

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

      {/* Photo-Video Section MAIN*/}
      <TabsComponent storage={storage} Tab1={PhotoContainer} Tab2={VideoContainer}/>

    </div>
  );
}

export default HomePage;