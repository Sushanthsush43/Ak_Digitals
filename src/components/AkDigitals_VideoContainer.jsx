import React, { useState, useEffect } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { toastErrorStyle } from './utils/toastStyle';
import { InView } from "react-intersection-observer";
import { isIOSorMacDevice } from './utils/deviceUtils';
import './../css/VideoContainer.css';
import './../css/Fullscreen.css';
import FloatingScrollBtn from './utils/scrollToTop/FloatingBtn';
import EndReachedBtn from './utils/scrollToTop/EndReachedBtn';
import { collection, getDocs, query, orderBy, limit, startAfter } from "firebase/firestore";

function VideoContainer({firestore}) {

  const [isOpened, setIsOpened] = useState(false);
  const [data, setData] = useState({ video: '', i: 0 });
  const [videoUrls, setVideoUrls] = useState([]);
  const [isIOS, setIsIos] = useState(true); // for safety we will assume its IOS intialy
  const [viewMorePaused, setViewMorePaused] = useState(false);
  const [endReached, setEndReached] = useState(false);
  const [floatingDisabled, setFloatingDisabled] = useState(false);
  const [showNoMediaMessageDelay, setShowNoMediaMessageDelay] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);

  // set delay for no media message
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNoMediaMessageDelay(true);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

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
      handleFullScreenEnded()
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
      setIsOpened(false);
    }
  }

  const handleFullScreenEnded = () => {
      const videoElement = document.querySelector('.full-screen-video');
      if (videoElement) {
          videoElement.pause();
      }
  };

  useEffect(() => {
    fetchVideos(true);
  }, []);

  const fetchVideos = async (isInitial = false) => {
    try {
        let q;

        if (isInitial || !lastDoc) {
            q = query(
                collection(firestore, "videos"),
                orderBy("createdAt", "desc"),
                limit(9)
            );
        } else {
            q = query(
                collection(firestore, "videos"),
                orderBy("createdAt", "desc"),
                startAfter(lastDoc),
                limit(9)
            );
        }

        const snapshot = await getDocs(q);

        const urls = snapshot.docs.map(doc => ({
            videoUrl: doc.data().url,
            thumbnailUrl: doc.data().url.replace("/video/upload/", "/video/upload/so_1/")  // Cloudinary feature thumbnail
              .replace(/\.[^/.]+$/, ".jpg"),
            loaded: false
        }));

        if (isInitial) {
            setVideoUrls(urls);
        } else {
            setVideoUrls(prevUrls => [...prevUrls, ...urls]);
        }

        if (!snapshot.empty)
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        if (snapshot.empty || snapshot.docs.length < 9) {
            setEndReached(true);
        }

    } catch (error) {
        toast.error("Something went wrong, Please try again!", toastErrorStyle());
        console.error(error);
    }
  };

  const handleViewMore = () => {
    if (viewMorePaused || endReached)
        return;

    setViewMorePaused(true);
    setTimeout(() => {
        fetchVideos();
        setViewMorePaused(false);
    }, 2250);
  };

  const handleVideoLoad = (index) => {
    setVideoUrls(prevVideoUrls => {
      const updatedVideoUrls = [...prevVideoUrls];
      updatedVideoUrls[index].loaded = true;
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
      
      {!floatingDisabled ? <FloatingScrollBtn /> : null }

      <div className={`video-container ${isOpened ? 'animate' : ''}`}>
        {videoUrls.length>0 ?
          <ResponsiveMasonry columnsCountBreakPoints={{ 380: 1, 750: 2, 900: 3 }}>
            <Masonry gutter='17px'>
              {videoUrls.map(({ videoUrl, thumbnailUrl, loaded }, index) => (
                <InView
                  as="video"
                  className='image-video'
                  key={index}
                  data-index={index}
                  onChange={(inView, entry) => {
                    if (entry.isIntersecting || entry.boundingClientRect.top < 200) {
                      inView && loaded ? (videoUrl = videoUrl) : (videoUrl = '');
                    }
                  }}
                  onContextMenu={(e)=> e.preventDefault()}
                  onMouseEnter={(e) => { handlePlay(e.target); videoUrl = videoUrl; thumbnailUrl = false}}
                  onMouseLeave={(e) => { handlePause(e.target); videoUrl = ''; thumbnailUrl = thumbnailUrl}}
                  onLoadedData={() => handleVideoLoad(index)}
                  src={videoUrl}
                  poster={thumbnailUrl}
                  onError={(e) => console.error('Error playing video while hover (hover):', e.target.error)}
                  alt={`Video ${index}`}
                  onClick={()=>viewVideo(videoUrl, index)}
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
        :
          <center>{showNoMediaMessageDelay && <div>Nothing here yet. Stay tuned!</div>}</center>
        }
      </div>

      {!endReached?
          <div className='loading-viewMore' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
            {videoUrls.length > 0 && (
                <InView
                    as="div"
                    className='loading'
                    onChange={(inView) => {
                        if (inView && !viewMorePaused && !endReached)
                            handleViewMore();
                    }}>
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