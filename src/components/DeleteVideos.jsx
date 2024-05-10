import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toastErrorStyle, toastSuccessStyle } from './uitls/toastStyle';
import { InView } from "react-intersection-observer";
import "../css/DeleteComp.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

function DeleteVideos({storage}) {

    const [videoUrls, setVideoUrls] = useState([]);
    const [page, setPage] = useState(1);
    const videosPerPage = 27;
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [displayedPages, setDisplayedPages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [toDelete, setToDelete] = useState([]);
    const [videoRefs, setVideoRefs] = useState([]);
    const [isOpened, setIsOpened] = useState(false);
    const [data, setData] = useState({ video: '', i: 0 });

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
          let newIndex = data.i + 1;
          if (newIndex < videoUrls.length) {
            setData({ video: videoUrls[newIndex].url, i: newIndex });
          }
        } else if (action === 'previous-video') {
          let newIndex = data.i - 1;
          if (newIndex >= 0) {
            setData({ video: videoUrls[newIndex].url, i: newIndex });
          }
        } else if (action === 'close-video') {
          setIsOpened(false); // Close the full-screen view
        }
      }

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
                setTotalPages(totalPages);

                const urls = await Promise.all(videoRefs.items.slice(startIndex, endIndex).map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        return { url, loaded: false };
                    } catch (error) {
                        console.error('Error getting download URL for itemRef:', error);
                        return null;
                    }
                }));

                setVideoUrls(urls.filter(item => item !== null));

            } catch (error) {
                toast.error("Something went wrong, Please try again!", toastErrorStyle());
                console.error('Error listing items in storage:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }

    const handlePageChange = (newPage) => {
        setPage(newPage);

        if (totalPages > 10) {
            const newDisplayedPages = Array.from({ length: 10 }, (_, i) => newPage + i - 5)
                .filter(page => page > 0 && page <= totalPages);
            setDisplayedPages(newDisplayedPages);
        }
    };

    const handleVideoLoad = (index) => {
        setVideoUrls(prevVideoUrls => {
            const updatedVideoUrls = [...prevVideoUrls];
            updatedVideoUrls[index].loaded = true;
            return updatedVideoUrls;
        });
    };

    const handleSelect = async (videoUrl) => {
        if (toDelete.includes(videoUrl))
            setToDelete(prevToDelete => prevToDelete.filter(url => url !== videoUrl)); // If videoUrl is already in toDelete, remove it
        else
            setToDelete(prevToDelete => [...prevToDelete, videoUrl]); // If videoUrl is not in toDelete, add it
    };

    const handleDeleteVideos = async () => {
        try {
            if (toDelete.length <= 0) {
                toast.error("No video selected", toastErrorStyle());
                return;
            }

            // Display confirmation dialog
            const confirmed = window.confirm("Are you sure you want to delete the selected videos?");
            if (!confirmed) { // User canceled 
                setToDelete([]); // clear selection
                return;
            }

            await Promise.all(toDelete.map(async (url) => {
                const videoRef = ref(storage, url);
                await deleteObject(videoRef);
                // Remove the deleted video URL from the state
                setVideoUrls(prevVideoUrls => prevVideoUrls.filter(item => item.url !== url));
            }));

            // Clear the toDelete array
            setToDelete([]);
            toast.success("Videos deleted successfully", toastSuccessStyle());
        } catch (error) {
            console.error('Error deleting videos:', error);
            toast.error("Failed to delete videos. Please try again.", toastErrorStyle());
        }
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
                <video src={data.video}
                    className="full-screen-video"
                    controls
                    onError={(e) => console.error('Error playing video while hover:', e.target.error)}>
                </video>
                {data.i < videoUrls.length - 1 && (
                    <button className="nav-btn next-btn" onClick={() => videoAction('next-video')}>
                    <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                )}
                </div>
            )}
        <div className='delete-main'>
            {/* Delete Videos Button */}
            <button onClick={() => handleDeleteVideos()}>Delete</button>

            {/* Video container */}
            <div className='delete-container'>
                {videoUrls.map(({ url, loaded }, index) => (
                    <div key={index} className='delete-item-div'>
                    <InView
                        as="video"
                        className='delete-item image-video'
                        key={index}
                        data-index={index}
                        src={url}
                        onMouseEnter={(e) => { handlePlay(e.target); }}
                        onMouseLeave={(e) => { handlePause(e.target); }}
                        onChange={(inView, entry) => {
                            // Trigger inView callback even before fully visible
                            if (entry.isIntersecting || entry.boundingClientRect.top < 100) {
                              inView && loaded ? (url = url) : (url = '');
                            }
                          }}
                        onClick={() => viewVideo(url, index)} // Click to open video in full-screen
                        onError={(e) => console.error('Error playing video while hover:', e.target.error)}
                        style={{ display: loaded ? 'block' : 'none' }}
                        onLoadedData={() => handleVideoLoad(index)}
                        autoPlay={false}
                        muted
                    ></InView>
                    {/* Delete Selection */}
                    <label
                        className='delete-button'
                        style={{ color: toDelete.includes(url) ? 'red' : 'black' }}
                        onClick={() => handleSelect(url)}
                    >
                        <RiDeleteBinLine />
                    </label>
                    </div>
                ))}
                {/* Loading animation */}
                {isLoading && <div>Loading ...</div>}
            </div>


            <div className='pagination'>
                {totalPages > 10 ?
                    displayedPages.map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            disabled={isLoading || pageNum === page}
                        >
                            {pageNum}
                        </button>
                    ))
                    :
                    Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            disabled={isLoading || (i + 1 === page)}
                        >
                            {i + 1}
                        </button>
                    ))
                }
            </div>
         </div>
        </>
    );
}

export default DeleteVideos;