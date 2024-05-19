import React, { useState } from 'react';
import PhotoUpload from './PhotoUpload';
import VideoUpload from './VideoUpload';
import './../css/PhotoVideoTab.css';

const UploadTab = ({storage}) => {
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
        {activeTab === 0 && <PhotoUpload storage={storage}/>}
        {activeTab === 1 && <VideoUpload storage={storage}/>}
      </div>
    </div>
  );
};

export default UploadTab;