import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdImages,IoIosVideocam } from "react-icons/io";
import '../css/Dashboard.css';
import UploadTab from '../components/PhotoVideoUploadTab';
import { getFirebaseConfig } from '../components/uitls/firebaseConfig';
const { storage, app } = getFirebaseConfig();

function DashBoard(){

    return (
        <div className='DashBoard-div'>
        
            <div className='header-Main'>
                <div className="heading-container">
                    <h1 className="sofia-regular">AK DIGITALS</h1>
                </div>
                <div className='header-links'>
                    <Link to='/ContactPage' className="teko-headings">CONTACT</Link>
                </div>
            </div>
            <div className='MainDashBoardDiv'>
                <div className='CountDiv'>
                    <div className='PhotoCountDiv'>
                        <IoMdImages className='cameraIcon'/>
                        <p>PHOTOS<br/><span>100</span></p>
                    </div>
                    <div className='VideoCountDiv'>
                        <IoIosVideocam className='VideoIcon'/>
                        <p>VIDEOS<br/><span>100</span></p>  
                    </div>
                </div>
                <div className='Update-div'>
                    <UploadTab/>
                </div>
    
            </div>
        </div>
    );
}

export default DashBoard;
