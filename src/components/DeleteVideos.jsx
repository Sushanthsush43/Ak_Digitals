import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toastErrorStyle, toastSuccessStyle } from './uitls/toastStyle';
import { InView } from "react-intersection-observer";
import "../css/Delete.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function DeleteVideos() {
    const [videoUrls, setVideoUrls] = useState([]);
    const [page, setPage] = useState(1);
    const videosPerPage = 27;
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [displayedPages, setDisplayedPages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [toDelete, setToDelete] = useState([]);
    const [videoRefs, setVideoRefs] = useState([]);

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
    
    return (
        <>
        <div className='delete-main'>
            {/* Delete Videos Button */}
            <button onClick={() => handleDeleteVideos()}>Delete</button>

            {/* Video container */}
            <div className='delete-container'>
                {videoUrls.map(({ url, loaded }, index) => (
                    <div key={index} className='delete-item-div'>
                    <InView
                        className='delete-item'
                        as="video"
                        key={index}
                        data-index={index}
                        src={url}
                        onMouseEnter={(e) => {e.target.play(); e.target.controls = true;}}
                        onMouseLeave={(e) => {e.target.pause(); e.target.controls = false;}}
                        onError={(e) => console.error('Error playing video while hover:', e.target.error)}
                        onChange={(inView) => { inView && loaded ? url = url : url = '' }}
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