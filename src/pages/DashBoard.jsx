import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImArrowLeft2 } from "react-icons/im";
import '../css/Dashboard.css';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/utils/toastStyle';
import TabsComponent from '../components/TabsComponent';
import PhotoUpload from '../components/PhotoUpload';
import VideoUpload from '../components/VideoUpload';
import { CheckAdminLogin } from '../components/utils/checkAdminLogin';
import { getDashboardData } from '../components/utils/getDashboardData';
import DashBoardCounts from '../components/DashboardCounts';
import PieChart from '../components/PieChart.jsx';

function DashBoard({ storage, app }) {
  // Check if authorized user, ie. admin
  CheckAdminLogin({app});

  const [imgsLength, setImgsLength] = useState(0);
  const [vidsLength, setVidsLength] = useState(0);
  const [dashboardCountRefresh, setDashboardCountRefresh] = useState(0);
  const [pieChartdata, setPieChartdata] = useState({ photoSize: 0, videoSize: 0, totalUsedSize: 0 });

  // refresh img-vid count when new file upload
  const handleCountRefresh = (count) => {
    setDashboardCountRefresh(count);
  }

  useEffect(() => {
      getDashboardData(storage).then((data) => {
        if (data) {
          setImgsLength(data.imgsLength);
          setVidsLength(data.vidsLength);
          setPieChartdata({ photoSize: data.imgSize, videoSize: data.vidSize, totalUsedSize: data.totalUsedSize });
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

                  <div className='piechart-div-main'>
                    <div className='dashboard-head-texts'>
                        Storage Distribution
                    </div>
                    <PieChart data={pieChartdata}/>
                  </div>

                  <div className='dashboard-upload-main'>
                      <div className='dashboard-head-texts'>
                        Upload
                      </div>
                      <TabsComponent storage={storage} Tab1={PhotoUpload} Tab2={VideoUpload} waitBeforeSwitch={true} dashboardCountRefresh={handleCountRefresh}/>
                  </div>
                  <div className='dashboard-delete-main'>
                      <div className='dashboard-head-texts'>
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