import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages, IoIosVideocam } from "react-icons/io";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import '../css/Dashboard.css';
import { ref, listAll } from 'firebase/storage';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/uitls/toastStyle';
import TabsComponent from '../components/TabsComponent';
import PhotoUpload from '../components/PhotoUpload';
import VideoUpload from '../components/VideoUpload';
import { CheckAdminLogin } from '../components/uitls/checkAdminLogin';

function DashBoard({ storage, app }) {
  // Check if authorized user, ie. admin
  CheckAdminLogin({app});

  const [imgCount, setImgCount] = useState(0);
  const [vidCount, setVidCount] = useState(0);
  const [imgsLength, setImgsLength] = useState(0);
  const [vidsLength, setVidsLength] = useState(0);
  const imgIntervalRef = useRef(null);
  const vidIntervalRef = useRef(null);

  async function getFilesCount() {
    try {
      const imgRef = await listAll(ref(storage, 'images'));
      setImgsLength(imgRef.items.length);

      const vidRef = await listAll(ref(storage, 'videos'));
      setVidsLength(vidRef.items.length);
    } catch (error) {
      toast.error("Something went wrong, couldn't fetch file count", toastErrorStyle());
      console.error('Error getting files count', error);
    }
  }

  useEffect(() => {
    getFilesCount();
  }, []);

  const handleCountInterval = () => {
    if (imgsLength > 0) {
      let imgCount = 0;
      imgIntervalRef.current = setInterval(() => {
        imgCount++;
        setImgCount(imgCount);
        if (imgCount >= imgsLength) {
          clearInterval(imgIntervalRef.current);
        }
      }, 100);
    }

    if (vidsLength > 0) {
      let vidCount = 0;
      vidIntervalRef.current = setInterval(() => {
        vidCount++;
        setVidCount(vidCount);
        if (vidCount >= vidsLength) {
          clearInterval(vidIntervalRef.current);
        }
      }, 100);
    }
  };

  useEffect(() => {
    if (imgsLength > 0 || vidsLength > 0) {
      handleCountInterval();
    }

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(imgIntervalRef.current);
      clearInterval(vidIntervalRef.current);
    };
  }, [imgsLength, vidsLength]);

  return (
    <div className='DashBoard-div'>

        {/* Header Section */}
        <div className='header-Main'>
            <div className="heading-container">
                <h1 className="sofia-regular">AK DIGITALS</h1>
            </div>
        </div>

        {/* Back Button Section */}
        <div className='dashboard-back-btn'>
            <Link to='/' className="teko-headings">
                <FontAwesomeIcon icon={faChevronLeft} />
            </Link>
        </div>

        <div className='MainDashBoardDiv'>
            <div className='CountDiv'>
                <div className='PhotoCountDiv'>
                    <IoMdImages className='cameraIcon' />
                    <p>PHOTOS<br /><span>{imgCount}</span></p>
                </div>
                <div className='VideoCountDiv'>
                    <IoIosVideocam className='VideoIcon' />
                    <p>VIDEOS<br /><span>{vidCount}</span></p>
                </div>
            </div>

            <div className='Update-div'>
                <TabsComponent storage={storage} Tab1={PhotoUpload} Tab2={VideoUpload} waitBeforeSwitch={true}/>
            </div>
            <div className='dashboard-delete-section'>
                <Link to='/deletephotos' className="teko-headings">Delete Photos</Link>
                <Link to='/deletevideos' className="teko-headings">Delete Videos</Link>
            </div>
        </div>
    </div>
  );
}

export default DashBoard;