import React, { useState } from 'react';
import PhotoContainer from './../components/PhotoContainer';
import VideoContainer from './../components/VideoContainer';
import './../css/PhotoVideoTab.css';

const Tabs = ({storage}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (
    <div className='photo-video-tab-main'>
      <div className="tab-bar">
        <div className={`indicator ${activeTab === 0 ? 'tab1' : activeTab === 1 ? 'tab2' : 'tab3'}`}></div>
        <div className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>photo</div>
        <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>video</div>
      </div>
      <div className="content">
        {activeTab === 0 && <PhotoContainer storage={storage}/>}
        {activeTab === 1 && <VideoContainer storage={storage}/>}
      </div>
    </div>
  );
};

export default Tabs;