import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage';
import { toast } from 'react-toastify';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toastErrorStyle, toastSuccessStyle } from './uitls/toastStyle';
import { InView } from "react-intersection-observer";
import "../css/DeleteComp.css";
import './../css/Fullscreen.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { isIOSorMacDevice } from './uitls/deviceUtils';
import { CheckAdminLogin } from './uitls/checkAdminLogin';

function DeleteVideos({storage, app}) {

    // Check if authorized user, ie. admin
    CheckAdminLogin({app});

    const [videoUrls, setVideoUrls] = useState([]);
    const [page, setPage] = useState(1);
    const videosPerPage = 15;
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [displayedPages, setDisplayedPages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [toDeleteVideos, setToDeleteVideos] = useState([]);
    const [toDeleteThumbnails, setToDeleteThumbnails] = useState([]);
    const [videoRefs, setVideoRefs] = useState([]);
    const [isOpened, setIsOpened] = useState(false);
    const [data, setData] = useState({ video: '', i: 0 });
    const [isIOS, setIsIos] = useState(true); // for safety we will assume its IOS initialy
    let isSomeFailed = false;
    let isCompleteFailed = false;
    
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
            const videoRefs = videoRefsTemp.items;
    
            // Fetch metadata for each video to get the upload time
            const videosWithMetadata = await Promise.all(
                videoRefs.map(async (videoRef) => {
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
        } finally {
            setIsLoading(false);
        }
      }

    async function fetchVideos() {
        if (videoRefs && videoRefs.length >= 1) {
            setIsLoading(true);
            try {
                const startIndex = (page - 1) * videosPerPage;
                const endIndex = startIndex + videosPerPage;

                const totalPages = Math.ceil(videoRefs.length / videosPerPage);
                setTotalPages(totalPages);

                const urls = await Promise.all(videoRefs.slice(startIndex, endIndex).map(async (itemRef) => {
                    try {
                        const videoUrl = await getDownloadURL(itemRef);
                        const thumbnailName = itemRef.name.slice(0, -4) + '.png';

                        const thumbnailRef = ref(storage, `thumbnails/${thumbnailName}`);
                        // console.log("video = ",videoUrl)

                        const thumbnailUrl = await getDownloadURL(thumbnailRef);
                        // console.log("thumbnail ",thumbnailUrl)

                        return { videoUrl, thumbnailUrl, loaded: false, constVideoUrl : videoUrl, constThumbnailUrl : thumbnailUrl};
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

        // Display confirmation dialog
        if(toDeleteVideos.length !== 0){
            const confirmed = window.confirm("Moving to another page will clear the selected videos. Are you sure you want to proceed?");
            if (!confirmed) { // User canceled 
                return;
            }
        }

        // before moving to other page, clear the selection
        setToDeleteVideos([]); // clear selection
        setToDeleteThumbnails([]); // clear selection

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

    const handleSelect = async (constVideoUrl, constThumbnailUrl) => {
        
        let vidVal = false;
        let thumbVal = false;

        if (toDeleteVideos.includes(constVideoUrl))
            vidVal = true;

        if (toDeleteThumbnails.includes(constThumbnailUrl))
            thumbVal = true;

        // check if video selection & thumbnail selection(happens automatic) are syncing
        if(vidVal !== thumbVal){
            toast.error("Something went wrong, Please try selecting again.", toastErrorStyle());
            return;
        }

        if (vidVal){
            setToDeleteVideos(prevToDelete => prevToDelete.filter(url => url !== constVideoUrl)); // If videoUrl is already in toDelete, remove it
        }
        else{
            setToDeleteVideos(prevToDelete => [...prevToDelete, constVideoUrl]); // If videoUrl is not in toDelete, add it
        }

        if (thumbVal){
            setToDeleteThumbnails(prevToDelete => prevToDelete.filter(url => url !== constThumbnailUrl)); // If thumbnailUrl is already in toDelete, remove it
        }
        else{
            setToDeleteThumbnails(prevToDelete => [...prevToDelete, constThumbnailUrl]); // If thumbnailUrl is not in toDelete, add it
        }

    };

    // handle delete icon color change
    const getColor = (constVideoUrl) => {
        return toDeleteVideos.includes(constVideoUrl) ? 'red' : 'black';
    }
    

    const handleDeleteVideos = async () => {
        // video checking is enough, since they will always be synced in handleSelect()
        if (toDeleteVideos.length <= 0) {
            toast.error("No video selected", toastErrorStyle());
            return;
        }

        // Display confirmation dialog
        const confirmed = window.confirm("Are you sure you want to delete the selected videos?");
        if (!confirmed) { // User canceled 
            setToDeleteVideos([]); // clear selection
            setToDeleteThumbnails([]); // clear selection
            return;
        }
        try {
            isSomeFailed = false;
            isCompleteFailed = false;

            for(let i=0;i<toDeleteVideos.length;i++){
                try{
                     // Delete video
                    const videoUrl = toDeleteVideos[i];
                    const videoRef = ref(storage, videoUrl);
                    await deleteObject(videoRef);
                    
                    // Delete thumbnail
                    const thumbnailUrl = toDeleteThumbnails[i];
                    const thumbnailRef = ref(storage, thumbnailUrl);
                    await deleteObject(thumbnailRef);

                    // Remove the deleted video URL & thumbnail URL from the state
                    setVideoUrls(prevVideoUrls => prevVideoUrls.filter(item => item.videoUrl !== videoUrl && item.thumbnailUrl !== thumbnailUrl));
                }catch(error){
                    console.error(`Error deleting one video or thumbnail : `, error);
                    isSomeFailed = true;
                }
            }
        } catch (error) {
            console.error('Error deleting videos:', error);
            toast.error("Failed to delete videos. Please try again.", {...toastErrorStyle(), autoClose:false});
            isCompleteFailed = true;
            return;
        } finally {
            // Clear the toDelete array
            setToDeleteVideos([]);
            setToDeleteThumbnails([]);

             // display appropriate toast message
             if (!isCompleteFailed && isSomeFailed)
                toast.error("Some files could not be deleted", {...toastErrorStyle(), autoClose:false}); // if some files couldn't be deleted
            else if (!isCompleteFailed && !isSomeFailed)
                toast.success("Videos deleted successfully", {...toastSuccessStyle(), autoClose:false}); // if all files are deleted
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
                    playsInline
                    onError={(e) => console.error('Error playing video while hover (click):', e.target.error)}>
                </video>
                {data.i < videoUrls.length - 1 && (
                    <button className="nav-btn next-btn" onClick={() => videoAction('next-video')}>
                    <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                )}
                </div>
            )}
        <div className='delete-main container mt-5'>
            <div className="d-flex mb-3 delete-label-btn">
                <label className='lead'><span className='text-danger'>{toDeleteVideos.length}</span> items selected</label>
                <button className="btn btn-danger" onClick={() => handleDeleteVideos()}>Delete</button>
            </div>

            {/* Video container */}
            <div className='delete-container row '>
                {videoUrls.map(({ videoUrl, thumbnailUrl, loaded, constVideoUrl, constThumbnailUrl }, index) => (
                    <div key={index} className='delete-item-div col-12 col-sm-6 col-md-6 col-lg-3'>
                    <InView
                        as="video"
                        className='delete-item image-video'
                        key={index}
                        data-index={index}
                        onContextMenu={(e)=> e.preventDefault()}
                        onMouseEnter={(e) => { handlePlay(e.target); videoUrl = videoUrl; thumbnailUrl = false}}
                        onMouseLeave={(e) => { handlePause(e.target); videoUrl = ''; thumbnailUrl = thumbnailUrl}}
                        onChange={(inView, entry) => {
                            // Trigger inView callback even before fully visible
                            if (entry.isIntersecting || entry.boundingClientRect.top < 100) {
                              inView && loaded ? (videoUrl = videoUrl) : (videoUrl = '');
                            }
                          }}
                        src={videoUrl}
                        poster={thumbnailUrl}
                        onClick={()=>viewVideo(videoUrl, index)} // Click to open video in full-screen
                        onError={(e) => console.error('Error playing video while hover (hover):', e.target.error)}
                        style={{ display: isIOS ? 'inline' : loaded ? 'inline' : 'none'}}  
                        onLoadedData={() => handleVideoLoad(index)}
                        autoPlay={false}
                        playsInline
                        loop
                        muted
                        type="video/mp4/mov"
                    ></InView>
                    {/* Delete Selection */}
                    <label
                        className='delete-button'
                        style={{color : getColor(constVideoUrl)}}
                        onClick={() => { handleSelect(constVideoUrl, constThumbnailUrl); }}
                    >
                        <RiDeleteBinLine  />
                    </label>
                    </div>
                ))}
                {/* Loading animation */}
                {isLoading && 
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>}
            </div>


            <div className='pagination d-flex justify-content-center mt-4 mb-4'>
                {totalPages > 10 ?
                    displayedPages.map((pageNum) => (
                        <button
                            key={pageNum}
                            className={`btn mx-1 ${pageNum === page ? 'btn-primary' : 'btn-outline-primary'}`}
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
                            className={`btn mx-1 ${i + 1 === page ? 'btn-primary' : 'btn-outline-primary'}`}
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