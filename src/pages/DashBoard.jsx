import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ImArrowLeft2 } from "react-icons/im";
import '../css/Dashboard.css';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/uitls/toastStyle';
import TabsComponent from '../components/TabsComponent';
import PhotoUpload from '../components/PhotoUpload';
import VideoUpload from '../components/VideoUpload';
import { CheckAdminLogin } from '../components/uitls/checkAdminLogin';
import { getDashboardData } from '../components/uitls/getDashboardData';
import DashBoardCounts from '../components/DashboardCounts';

function DashBoard({ storage, app }) {
  // Check if authorized user, ie. admin
  CheckAdminLogin({app});

  const [imgsLength, setImgsLength] = useState(0);
  const [vidsLength, setVidsLength] = useState(0);
  const [dashboardCountRefresh, setDashboardCountRefresh] = useState(0);

  // refresh img-vid count when new file upload
  const handleCountRefresh = (count) => {
    setDashboardCountRefresh(count);
  }

  useEffect(() => {
      getDashboardData(storage).then((data) => {
        if (data) {
          setImgsLength(data.imgsLength);
          setVidsLength(data.vidsLength);
        } else {
          toast.error("Something went wrong", toastErrorStyle());
        }
      });
  }, [dashboardCountRefresh]);

  return (
          <div className='DashBoard-div'>

              {/* Header Section */}
              <div className='header-Main'>
                  <div className="heading-container">
                      <h1 className="sofia-regular header-gradient-text">AK DIGITALS</h1>
                  </div>
              </div>

              {/* Back Button Section */}
              <div className='back-btn'>
                  <Link to='/'>
                    <ImArrowLeft2 />
                  </Link>
              </div>

              <div className='MainDashBoardDiv'>
                  {/* Count section */}
                  <DashBoardCounts imgsLength={imgsLength} vidsLength={vidsLength}/>

                  <div className='dashboard-upload-main'>
                      <div className='dashboard-upload-head'>
                        Upload
                      </div>
                      <TabsComponent storage={storage} Tab1={PhotoUpload} Tab2={VideoUpload} waitBeforeSwitch={true} dashboardCountRefresh={handleCountRefresh}/>
                  </div>
                  <div className='dashboard-delete-main'>
                      <div className='dashboard-delete-head'>
                            Delete
                      </div>
                      <div className='dashboard-delete-btns'>
                        <Link to='/deletephotos' >Photos</Link>
                        <Link to='/deletevideos' >Videos</Link>
                      </div>
                  </div>
                  <div>
                    
                  </div>
              </div>
          </div>
  );
}

export default DashBoard;