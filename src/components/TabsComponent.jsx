import React, { useState, useEffect } from 'react';
import './../css/TabsComponent.css';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';

// needs to be outside
let dashboardCountRefreshCount = 0;

const TabsComponent = ({ storage, Tab1, Tab2, waitBeforeSwitch = false, dashboardCountRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [runCompleted, setRunCompleted] = useState(true);

  const handleTabClick = (index) => {
    if (waitBeforeSwitch && !runCompleted) {
      toast.error('Please wait until the upload is completed', { ...toastErrorStyle(), autoClose: 1500 });
      return;
    }
    setActiveTab(index);
  };

  const handleRunCompleted = (completed) => {
    setRunCompleted(completed);
    if (completed) {
      if (dashboardCountRefresh) {
        dashboardCountRefreshCount += 1;
        dashboardCountRefresh(dashboardCountRefreshCount);
      }
    }
  };

  return (
    <div className='photo-video-tab-main'>
      <div className="tab-bar">
        <div className={`indicator ${activeTab === 0 ? 'tab1' : activeTab === 1 ? 'tab2' : 'tab3'}`}></div>
        <div className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => handleTabClick(0)}>photos</div>
        <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => handleTabClick(1)}>videos</div>
      </div>
      <div className="content">
        {
          waitBeforeSwitch ?
            <>
              {activeTab === 0 && <Tab1 storage={storage} runCompleted={handleRunCompleted} />}
              {activeTab === 1 && <Tab2 storage={storage} runCompleted={handleRunCompleted} />}
            </> :
            <>
              {activeTab === 0 && <Tab1 storage={storage} />}
              {activeTab === 1 && <Tab2 storage={storage} />}
            </>
        }
      </div>
    </div>
  );
};

export default TabsComponent;