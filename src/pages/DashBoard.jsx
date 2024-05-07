import React from 'react';
import { Link } from 'react-router-dom';
import { GrInstagram } from 'react-icons/gr'; // Assuming GrInstagram is imported
import { AiFillCamera } from "react-icons/ai";
import '../css/Dashboard.css';

function DashBoard(){

    return (
        <div>
            <div className='Navigation'>
                <header>
                    <h1 className="sofia-regular">sushanth sherigar</h1>
                    <div className='header-links'>
                        <Link to='/PhotoUpload' className="teko-heading">UPLOAD</Link>
                        <Link to='/ContactPage' className="teko-headings">CONTACT</Link>
                        {/* Use anchor tag for external URL */}
                        <a href='https://www.instagram.com/abhi.devadi?igsh=MW1pdGcxcjhpZzRiNA==' className="teko-heading1">
                            <GrInstagram style={{ color: '#3E3232', width: '26px', height: '25px' }} />
                        </a>
                    </div>
                </header>
            </div>
            <div className='MainDashBoardDiv'>
                <div className='CountDiv'>
                    <div className='PhotoCount'>
                        <span>100</span>
                    </div>
                    <div className='VideoCount'>
                        <span>100</span>
                    </div>
                    <div className='VisitorCount'>
                        <span>100</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashBoard;
