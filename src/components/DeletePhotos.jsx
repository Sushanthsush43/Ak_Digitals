import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';
import { RiDeleteBinLine } from 'react-icons/ri'; // Import delete icon from react-icons
import { toastErrorStyle, toastSuccessStyle } from './uitls/toastStyle';

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

function DeletePhotos() {
    const [imageUrls, setImageUrls] = useState([]);
    const [page, setPage] = useState(1);
    const imagesPerPage = 25;
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [displayedPages, setDisplayedPages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [toDelete, setToDelete] = useState([]);
    const [imageRefs, setImageRefs] = useState([]);

    useEffect(() => {
        initialFetchImages(); // only once retreive all images from database
    }, []);
    
    useEffect(() => {
        fetchImages();
    }, [page,imageRefs]);

    async function initialFetchImages()
    {
        setIsLoading(true);
        try {
            const imageRefs_temp = await listAll(ref(storage, 'images')); // List items inside 'images' folder
            setImageRefs(imageRefs_temp);
        } catch (error) {
            toast.error("Something went wrong, Please try again!",toastErrorStyle());
            console.error('Error listing items in storage:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchImages() {
        if(imageRefs && imageRefs.items && imageRefs.items.length >= 1){
            setIsLoading(true);
            try {
                const startIndex = (page - 1) * imagesPerPage;
                const endIndex = startIndex + imagesPerPage;

                const totalPages = Math.ceil(imageRefs.items.length / imagesPerPage);
                setTotalPages(totalPages);

                const urls = await Promise.all(imageRefs.items.slice(startIndex, endIndex).map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        return { url, loaded: false };
                    } catch (error) {
                        console.error('Error getting download URL for itemRef:', error);
                        return null;
                    }
                }));

                setImageUrls(urls.filter(item => item !== null));

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

    const handleImageLoad = (index) => {
        setImageUrls(prevImageUrls => {
            const updatedImageUrls = [...prevImageUrls];
            updatedImageUrls[index].loaded = true;
            return updatedImageUrls;
        });
    };

    const handleSelect = async (imgUrl) => {
            if (toDelete.includes(imgUrl)) 
                setToDelete(prevToDelete => prevToDelete.filter(url => url !== imgUrl)); // If imgUrl is already in toDelete, remove it
            else
                setToDelete(prevToDelete => [...prevToDelete, imgUrl]); // If imgUrl is not in toDelete, add it
    };

    const handleDeleteImages = async () => {
        try {
            if(toDelete.length <= 0){
                toast.error("No image selected", toastErrorStyle());   
                return;
            }

            // Display confirmation dialog
            const confirmed = window.confirm("Are you sure you want to delete the selected images?");
            if (!confirmed) { // User canceled 
                setToDelete([]); // clear selection
                return;
            }

            await Promise.all(toDelete.map(async (url) => {
                const imageRef = ref(storage, url);
                await deleteObject(imageRef);
                // Remove the deleted image URL from the state
                setImageUrls(prevImageUrls => prevImageUrls.filter(item => item.url !== url));
            }));
            
            // Clear the toDelete array
            setToDelete([]);
            toast.success("Images deleted successfully", toastSuccessStyle());
        } catch (error) {
            console.error('Error deleting images:', error);
            toast.error("Failed to delete images. Please try again.", toastErrorStyle());
        }
    };

    return (
        <>
            {/* Delete Images Button */}
            <button onClick={() => handleDeleteImages()}>Delete</button>

            {/* Photo container */}
            <div className='photo-container'>
                {imageUrls.map(({ url, loaded }, index) => (
                <div key={index} style={{ position: 'relative',
                                          display: 'inline-block',
                                          marginRight: '10px',
                                          marginBottom: '10px'
                                        }}>
                    <img
                        src={url}
                        alt={`Img ${index}`}
                        style={{ display: loaded ? 'block' : 'none', cursor: 'pointer' }}
                        onLoad={() => handleImageLoad(index)}
                        onClick={() => handleSelect(url)}
                    />
                    {/* Delete Selection */}
                    <label
                        style={{
                            display: loaded ? 'inline' : 'none',
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: toDelete.includes(url) ? 'red' : 'black' // Change color if URL is in toDelete array
                        }}
                        onClick={() => handleSelect(url)}>
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

            {/* <div style={{ position: 'relative', display: 'inline-block' }}>
    <img src="assets/logo.jpg" alt="Your Image" style={{ width: '100%', height: 'auto' }} />
    <button style={{ position: 'absolute', top: '0', right: '0' }}>Your Button</button>
</div> */}
        </>
    );
}

export default DeletePhotos;
