import React, { useEffect, useState, useRef } from 'react';
import { IoMdImages, IoIosVideocam } from "react-icons/io";

function DashBoardCounts({imgsLength = 0, vidsLength = 0}) {
    const [imgCount, setImgCount] = useState(0);
    const [vidCount, setVidCount] = useState(0);
    const imgIntervalRef = useRef(null);
    const vidIntervalRef = useRef(null);
    
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
        <div className='count-div-main'>
            <div className='count-div-tabs'>
                <IoMdImages className='count-icon' />
                <p><span className='dashboard-count-text'>PHOTOS</span><br /><span className='dashboard-count'>{imgCount}</span></p>
            </div>
            <div className='count-div-tabs'>
                <IoIosVideocam className='count-icon' />
                <p><span className='dashboard-count-text'>Videos</span><br /><span className='dashboard-count'>{vidCount}</span></p>
            </div>
        </div>
    )
}

export default DashBoardCounts;
