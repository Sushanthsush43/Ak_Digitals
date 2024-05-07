import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { GrInstagram } from "react-icons/gr";
import '../css/HomePage.css';
import "./ContactPage"
import '../components/PhotoUpload';
<<<<<<< HEAD
import './UploadingTab'
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/uitls/toastStyle';
=======
>>>>>>> 83aa905c740c3f2cae674c91a5ab99eda2d8f931
import VideoUpload from '../components/VideoUpload';
import DeleteVideos from '../components/DeleteVideos';
import DeletePhotos from '../components/DeletePhotos';
import PhotoContainer from '../components/PhotoContainer';

function HomePage() {

  const [showHoverText, setShowHoverText] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowHoverText(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`Maindiv`}>
      <header>
        <div className="heading-container">
          <h1 className="sofia-regular">sushanth sherigar</h1>
        </div>

        <div className='header-links'>
          <Link to='/UploadingTab' className="teko-heading">UPLOAD</Link>
          <Link to='/ContactPage' className="teko-headings">CONTACT</Link>
          <Link to='https://www.instagram.com/abhi.devadi?igsh=MW1pdGcxcjhpZzRiNA==' className="teko-heading1">
            <GrInstagram style={{ color: '#3F2305', width: '26px', height: '25px' }} />
          </Link>
        </div>
      </header>

      <p className={`hoverText ${showHoverText ? 'show' : ''}`}>
        <h4 style={{ textAlign: 'center' }}>WE CAPTURE THE MOMENTS</h4>
        <ul style={{ listStyleType: 'none', padding: '' }}>
          <li>Trust us to capture the magic of your life's journey, one frame at a time, freezing fleeting
            moments into extraordinary memories with our passion and keen eye for detail.</li>

        </ul>
      </p>

<<<<<<< HEAD
      {/* <VideoUpload /> */}
      {/* <DeleteVideos /> */}
      {/* <DeletePhotos /> */}

      <>
        {data.img && (
          <div className={`full-screen-image-container ${isOpened ? 'open' : ''}`}>
            <button className="close-btn" onClick={() => imgAction('close-img')}>
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {data.i > 0 && (
              <button className="nav-btn prev-btn" onClick={() => imgAction('previous-img')}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            )}
            <img src={data.img} className="full-screen-image" alt="" />
            {data.i < imageUrls.length - 1 && (
              <button className="nav-btn next-btn" onClick={() => imgAction('next-img')}>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            )}
          </div>
        )}
      </>
      <div className={`photo-container ${isOpened ? 'animate' : ''}`}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter='17px'>
            {imageUrls.map(({ url, loaded }, index) => (
              <img
                key={index}
                onLoad={() => handleImageLoad(index)}
                src={url}
                alt={`Image ${index}`}
                data-index={index}
                onClick={() => viewImage(url, index)} // Add onClick to open image in full-screen
                rref={(element) => {
                  if (element && !loaded) {
                    if (!observer.current) {
                      observer.current = new IntersectionObserver(/* observer configuration */);
                    }
                    observer.current.observe(element); // Observe the element
                  }
                }}

                style={{ display: loaded ? 'inline' : 'none' }}
              />
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      <div className='loading-viewMore' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
        {/* Loading animation */}
        {isLoading && <div className='loading'></div>}

        {/* Loading Button */}
        {imageUrls.length > 0 && (
          <button
            onClick={() => handleViewMore()}
            style={{
              backgroundColor: '#F5F5F5',
              color: '#3F2305',
              padding: '10px 20px',
              border: 'none',
              marginTop: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              position: 'relative',
              marginBottom: '20px'

            }}
          >
            VIEW MORE
            <div className='line'></div>

          </button>
        )}
      </div>

=======
      <PhotoContainer />
>>>>>>> 83aa905c740c3f2cae674c91a5ab99eda2d8f931
    </div>
  );
}

export default HomePage;