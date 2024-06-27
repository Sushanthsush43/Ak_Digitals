import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import { InView } from "react-intersection-observer";
import { isIOSorMacDevice } from './utils/deviceUtils';
import './../css/VideoContainer.css';
import './../css/Fullscreen.css';
import FloatingScrollBtn from './utils/scrollToTop/FloatingBtn';
import EndReachedBtn from './utils/scrollToTop/EndReachedBtn';

function VideoContainer({storage}) {

  const [isOpened, setIsOpened] = useState(false);
  const [data, setData] = useState({ video: '', i: 0 });
  const [videoUrls, setVideoUrls] = useState([]);
  const [page, setPage] = useState(1);
  const videosPerPage = 9;
  const [videoRefs, setVideoRefs] = useState([]);
  const [isIOS, setIsIos] = useState(true); // for safety we will assume its IOS intialy
  const [viewMorePaused, setViewMorePaused] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [floatingDisabled, setFloatingDisabled] = useState(false);

  useEffect(()=>{
    const i = isIOSorMacDevice();
    setIsIos(i);
  },[])

  // Function to view video
  const viewVideo = (video, i) => {
    setData({ video, i });
    setIsOpened(true);
  }

  useEffect(() => {
    if (isOpened)
      document.body.style.overflow = 'hidden';
    else
      document.body.style.overflow = '';

    // Clean up on unmount or when isOpened changes
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpened]);

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
    try {
        const videoRefsTemp = await listAll(ref(storage, 'videos')); // List items inside 'videos' folder
        const videoRefsItems = videoRefsTemp.items;

        // Fetch metadata for each video to get the upload time
        const videosWithMetadata = await Promise.all(
            videoRefsItems.map(async (videoRef) => {
                const metadata = await getMetadata(videoRef);
                return { ref: videoRef, timeCreated: metadata.timeCreated };
            })
        );

        // Sort videos by upload time, newest first
        videosWithMetadata.sort((a, b) => new Date(b.timeCreated) - new Date(a.timeCreated));

        // Remove the uploadTime from the final array
        const sortedVideoRefs = videosWithMetadata.map(video => video.ref);

        setVideoRefs(sortedVideoRefs);
    } catch (error) {
        toast.error("Something went wrong, Please try again!", toastErrorStyle());
        console.error('Error listing items in storage:', error);
    }
  }

  async function fetchVideos() {
    if (videoRefs && videoRefs.length >= 1) {
      try {
        const startIndex = (page - 1) * videosPerPage;
        const endIndex = startIndex + videosPerPage;
  
        const totalPages = Math.ceil(videoRefs.length / videosPerPage);
  
        const urls = await Promise.all(videoRefs.slice(startIndex, endIndex).map(async (itemRef) => {
          try {
            const videoUrl = await getDownloadURL(itemRef);
            const thumbnailName = itemRef.name.slice(0, itemRef.name.lastIndexOf('.')) + '.png';

            const thumbnailRef = ref(storage, `thumbnails/${thumbnailName}`);

            const thumbnailUrl = await getDownloadURL(thumbnailRef);

            return { videoUrl, thumbnailUrl, loaded: false };
          } catch (error) {
            console.error('Error getting download URL for itemRef:', error);
            return null;
          }
        }));
  
        // If it's the last page, reset the page count
        if (page === totalPages) {
          setPage(1);
          setEndReached(true);
        }
  
        setVideoUrls(prevUrls => [...prevUrls, ...urls.filter(url => url !== null)]);
      } catch (error) {
        toast.error("Something went wrong, Please try again!", toastErrorStyle());
        console.error('Error listing items in storage:', error);
      }
    }
  }

  const handleViewMore = () => {
    if (viewMorePaused)
        return;

    setViewMorePaused(true);
    setTimeout(() => {
        setPage(prevPage => prevPage + 1);
        setViewMorePaused(false);
    }, [2250]);
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
              onContextMenu={(e) => e.preventDefault()}
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
      
      {/* Scroll to top Floating Btn */}
      {!floatingDisabled ? <FloatingScrollBtn /> : null }

      <div className={`video-container ${isOpened ? 'animate' : ''}`}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 380: 1, 750: 2, 900: 3 }}>
          <Masonry gutter='17px'>
            {videoUrls.map(({ videoUrl, thumbnailUrl, loaded }, index) => (
              <InView
                as="video"
                className='image-video'
                key={index}
                data-index={index}
                onChange={(inView, entry) => {
                  // Trigger inView callback even before fully visible
                  if (entry.isIntersecting || entry.boundingClientRect.top < 200) {
                    inView && loaded ? (videoUrl = videoUrl) : (videoUrl = '');
                  }
                }}
                onContextMenu={(e)=> e.preventDefault()}
                onMouseEnter={(e) => { handlePlay(e.target); videoUrl = videoUrl; thumbnailUrl = false}}
                onMouseLeave={(e) => { handlePause(e.target); videoUrl = ''; thumbnailUrl = thumbnailUrl}}
                onLoadedData={() => handleVideoLoad(index)}
                onContextMenu={(e) => e.preventDefault()}
                src={videoUrl}
                poster={thumbnailUrl}
                onError={(e) => console.error('Error playing video while hover (hover):', e.target.error)}
                alt={`Video ${index}`}
                onClick={()=>viewVideo(videoUrl, index)} // Click to open video in full-screen
                style={{ display: isIOS ? 'inline' : loaded ? 'inline' : 'none',
                         cursor: 'pointer' }}                
                autoPlay={false}
                muted
                playsInline
                loop
                type="video/mp4/mov"
              >
              </InView>

            ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>

      {!endReached?
          <div className='loading-viewMore' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
            {/* Loading & ViewMore */}
            {videoUrls.length > 0 && (
                <InView
                    as="div"
                    className='loading'
                    onChange={(inView) => inView? handleViewMore()  : ''}>
                </InView>
            )}
          </div>
        :
          <>
              { videoUrls.length > 9 &&
                  <InView
                      as="div"
                      onChange={(inView) => inView? setFloatingDisabled(true)  : setFloatingDisabled(false)}>
                      <EndReachedBtn />
                  </InView>
              }
          </>
      }
    </>
  );
}

export default VideoContainer;