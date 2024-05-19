import React from 'react';
import { Link } from 'react-router-dom';
import { GrInstagram } from 'react-icons/gr'; // Assuming GrInstagram is imported
import { IoMdImages,IoIosVideocam } from "react-icons/io";
import '../css/Dashboard.css';
import Header from '../components/Header';
import PhotoVideoTab from '../components/PhotoVideoTab';

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
                <div className='Dashbord-tab'>
                    <PhotoVideoTab/>
                </div>
                <div className='Update-Div'>
                    
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
