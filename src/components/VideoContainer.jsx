import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './uitls/toastStyle';
import { InView } from "react-intersection-observer";
import { isIOSorMacDevice } from './uitls/isIOS';

function VideoContainer({storage}) {

  const [isOpened, setIsOpened] = useState(false);
  const [data, setData] = useState({ video: '', i: 0 });
  const [videoUrls, setVideoUrls] = useState([]);
  const [page, setPage] = useState(1);
  const videosPerPage = 9;
  const [isLoading, setIsLoading] = useState(false);
  const [videoRefs, setVideoRefs] = useState([]);
  const [isIOS, setIsIos] = useState(true); // for safety we will assume its IOS intialy

  useEffect(()=>{
    const i = isIOSorMacDevice();
    setIsIos(i);
  },[])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsOpened(true);
    }, 1000);
    setIsOpened(true);
    return () => clearTimeout(timeout);
  }, []);

  // Function to view video
  const viewVideo = (video, i) => {
    setData({ video, i });
    setIsOpened(true);
  }

  // Function to handle video actions (next, previous, close)
  const videoAction = (action) => {
    if (action === 'next-video') {
      handleFullScreenEnded() // pause previous video
      let newIndex = data.i + 1;
      if (newIndex < videoUrls.length) {
        setData({ video: videoUrls[newIndex].videoUrl, i: newIndex });
      }
    } else if (action === 'previous-video') {
      handleFullScreenEnded()
      let newIndex = data.i - 1;
      if (newIndex >= 0) {
        setData({ video: videoUrls[newIndex].videoUrl, i: newIndex });
      }
    } else if (action === 'close-video') {
      handleFullScreenEnded()
      setIsOpened(false); // Close the full-screen view
    }
  }

  const handleFullScreenEnded = () => {
      const videoElement = document.querySelector('.full-screen-video');
      if (videoElement) {
          videoElement.pause();
      }
  };


  useEffect(() => {
    initialFetchVideos(); // Fetch videos on component mount
  }, []);

  useEffect(() => {
    fetchVideos(); // Fetch videos when page or videoRefs change
  }, [page, videoRefs]);

  async function initialFetchVideos() {
    setIsLoading(true);
    try {
      const videoRefsTemp = await listAll(ref(storage, 'videos')); // List items inside 'videos' folder
      setVideoRefs(videoRefsTemp);
    } catch (error) {
      toast.error("Something went wrong, Please try again!", toastErrorStyle());
      console.error('Error listing items in storage:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchVideos() {
    if (videoRefs && videoRefs.items && videoRefs.items.length >= 1) {
      setIsLoading(true);
      try {
        const startIndex = (page - 1) * videosPerPage;
        const endIndex = startIndex + videosPerPage;
  
        const totalPages = Math.ceil(videoRefs.items.length / videosPerPage);
  
        const urls = await Promise.all(videoRefs.items.slice(startIndex, endIndex).map(async (itemRef) => {
          try {
            const videoUrl = await getDownloadURL(itemRef);
            const thumbnailName = itemRef.name.slice(0, itemRef.name.lastIndexOf('.')) + '.png';

            const thumbnailRef = ref(storage, `thumbnails/${thumbnailName}`);
            // console.log(videoUrl)

            const thumbnailUrl = await getDownloadURL(thumbnailRef);
            // console.log(thumbnailUrl)

            return { videoUrl, thumbnailUrl, loaded: false };
          } catch (error) {
            console.error('Error getting download URL for itemRef:', error);
            return null;
          }
        }));
  
        // If it's the last page, reset the page count
        if (page === totalPages) {
          setPage(1);
        }
  
        setVideoUrls(prevUrls => [...prevUrls, ...urls.filter(url => url !== null)]);
      } catch (error) {
        toast.error("Something went wrong, Please try again!", toastErrorStyle());
        console.error('Error listing items in storage:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleViewMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handleVideoLoad = (index) => {
    setVideoUrls(prevVideoUrls => {
      const updatedVideoUrls = [...prevVideoUrls];
      updatedVideoUrls[index].loaded = true; // Mark video as loaded
      return updatedVideoUrls;
    });
  };

  const handlePlay = (video) => {
      if (video.paused) {
          video.play()
          .catch(error => {
              console.error('Error playing video:', error);
          });
      }
  };

  const handlePause = (video) => {
      if (!video.paused) {
          video.pause();
      }
  };

  return (
    <>
      {data.video && (
        <div className={`full-screen-video-container ${isOpened ? 'open' : 'close'}`}>
          <button className="close-btn" onClick={() => videoAction('close-video')}>
            <FontAwesomeIcon icon={faTimes} />
          </button>

          {data.i > 0 && (
            <button className="nav-btn prev-btn" onClick={() => videoAction('previous-video')}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          <video 
              src={data.video}
              className="full-screen-video"
              controls
              playsInline
              onError={(e) => console.error('Error playing video while hover (click):', e.target.error)}
          >
          </video>
          {data.i < videoUrls.length - 1 && (
            <button className="nav-btn next-btn" onClick={() => videoAction('next-video')}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </div>
      )}

      <div className={`video-container ${isOpened ? 'animate' : ''}`}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3 }}>
          <Masonry gutter='17px'>
            {videoUrls.map(({ videoUrl, thumbnailUrl, loaded }, index) => (
              <InView
                as="video"
                className='image-video'
                key={index}
                data-index={index}
                onChange={(inView, entry) => {
                  // Trigger inView callback even before fully visible
                  if (entry.isIntersecting || entry.boundingClientRect.top < 100) {
                    inView && loaded ? (videoUrl = videoUrl) : (videoUrl = '');
                  }
                }}
                onMouseEnter={(e) => { handlePlay(e.target); videoUrl = videoUrl; thumbnailUrl = thumbnailUrl}}
                onMouseLeave={(e) => { handlePause(e.target); videoUrl = ''; thumbnailUrl = false}}
                onLoadedData={() => handleVideoLoad(index)}
                src={videoUrl}
                poster={thumbnailUrl}
                onError={(e) => console.error('Error playing video while hover (hover):', e.target.error)}
                alt={`Video ${index}`}
                onClick={() => viewVideo(videoUrl, index)} // Click to open video in full-screen
                style={{ display: isIOS ? 'inline' : loaded ? 'inline' : 'none',
                         cursor: 'pointer' }}                
                autoPlay={false}
                muted
                playsInline
                type="video/mp4/mov"
              >
              </InView>

            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      <div className='loading-viewMore' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
        {/* Loading animation */}
        {isLoading && <div className='loading'></div>}

        {/* Loading Button */}
        {videoUrls.length > 0 && (
          <InView
              as="div"
              onChange={(inView) => inView? handleViewMore()  : ''}
              style={{
              position: 'relative',
              width: '100px',
              height:'25px'
              }}>
              <div className='line'></div>
          </InView>
        )}
      </div>
    </>
  );
}

export default VideoContainer;
