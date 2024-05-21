import React, { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, deleteObject, getMetadata } from 'firebase/storage';
import { toast } from 'react-toastify';
import { RiDeleteBinLine } from 'react-icons/ri'; // Import delete icon from react-icons
import { toastErrorStyle, toastSuccessStyle } from './uitls/toastStyle';
import { InView } from "react-intersection-observer";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import "../css/DeleteComp.css";
import { CheckAdminLogin } from './uitls/checkAdminLogin';

function DeletePhotos({storage, app}) {

    // Check if authorized user, ie. admin
    CheckAdminLogin({app});

    const [imageUrls, setImageUrls] = useState([]);
    const [page, setPage] = useState(1);
    const imagesPerPage = 27;
    const [isLoading, setIsLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [displayedPages, setDisplayedPages] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    const [toDelete, setToDelete] = useState([]);
    const [imageRefs, setImageRefs] = useState([]);
    const [isOpened, setIsOpened] = useState(false);
    const [data, setData] = useState({ img: '', i: 0 });

    useEffect(() => {
        const timeout = setTimeout(() => {
          setIsOpened(true);
        }, 1000);
        setIsOpened(true);
        return () => clearTimeout(timeout);
      }, []);
    
      // Function to view image
      const viewImage = (img, i) => {
        setData({ img, i });
        setIsOpened(true);
      }
    
      // Function to handle image actions (next, previous, close)
      const imgAction = (action) => {
        if (action === 'next-img') {
          let newIndex = data.i + 1;
          if (newIndex < imageUrls.length) {
            setData({ img: imageUrls[newIndex].url, i: newIndex });
          }
        } else if (action === 'previous-img') {
          let newIndex = data.i - 1;
          if (newIndex >= 0) {
            setData({ img: imageUrls[newIndex].url, i: newIndex });
          }
        } else if (action === 'close-img') {
          setIsOpened(false); // Close the full-screen view
        }
      }    

    useEffect(() => {
        initialFetchImages(); // only once retreive all images from database
    }, []);
    
    useEffect(() => {
        fetchImages();
    }, [page,imageRefs]);

    async function initialFetchImages() {
        setIsLoading(true);
        try {
            const imageRefsTemp = await listAll(ref(storage, 'images')); // List items inside 'images' folder
            const imageRefs = imageRefsTemp.items;

            // Fetch metadata for each image to get the upload time
            const imagesWithMetadata = await Promise.all(
                imageRefs.map(async (imageRef) => {
                    const metadata = await getMetadata(imageRef);
                    return { ref: imageRef, timeCreated: metadata.timeCreated };
                })
            );

            // Sort images by upload time, newest first
            imagesWithMetadata.sort((a, b) => new Date(a.timeCreated) - new Date(b.timeCreated));

            // Remove the uploadTime from the final array
            const sortedImageRefs = imagesWithMetadata.map(image => image.ref);

            setImageRefs(sortedImageRefs);
        } catch (error) {
            toast.error("Something went wrong, Please try again!", toastErrorStyle());
            console.error('Error listing items in storage:', error);
        } finally {
            setIsLoading(false);
        }
    }

    async function fetchImages() {
        if(imageRefs && imageRefs.length >= 1){
            setIsLoading(true);
            try {
                const startIndex = (page - 1) * imagesPerPage;
                const endIndex = startIndex + imagesPerPage;

                const totalPages = Math.ceil(imageRefs.length / imagesPerPage);
                setTotalPages(totalPages);

                const urls = await Promise.all(imageRefs.slice(startIndex, endIndex).map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        return { url, loaded: false, constUrl : url };
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

        // Display confirmation dialog
        if(toDelete.length !== 0){
            const confirmed = window.confirm("Moving to another page will clear the selected photos. Are you sure you want to proceed?");
            if (!confirmed) { // User canceled 
                return;
            }
        }
        
        // before moving to other page, clear the selection
        setToDelete([]); // clear selection

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

    const handleSelect = async (constUrl) => {
        if (toDelete.includes(constUrl))
            setToDelete(prevToDelete => prevToDelete.filter(url => url !== constUrl)); // If imgUrl is already in toDelete, remove it
        else
            setToDelete(prevToDelete => [...prevToDelete, constUrl]); // If imgUrl is not in toDelete, add it
    };

    // handle delete icon color change
    const getColor = (constUrl) => {
        return toDelete.includes(constUrl) ? 'red' : 'black';
    }

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
            {data.img && (
                <div className={`full-screen-image-container ${isOpened ? 'open' : 'close'}`}>
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
            <div className='delete-main container mt-5'>
                {/* Delete Images Button */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                <label className='lead'><span className='text-danger'>{toDelete.length}</span> items selected</label>
                    <button className="btn btn-danger" onClick={() => handleDeleteImages()}>Delete</button>
                </div>

                {/* Photo container */}
                <div className='delete-container row'>
                    {imageUrls.map(({ url, loaded, constUrl }, index) => (
                        <div key={index} className='delete-item-div col-12 col-sm-6 col-md-6 col-lg-3'>
                            <InView
                                as="img"
                                className='delete-item image-video'
                                key={index}
                                onChange={(inView, entry) => {
                                    // Trigger inView callback even before fully visible
                                    if (entry.isIntersecting || entry.boundingClientRect.top < 100) {
                                        inView && loaded ? (url = url) : (url = '');
                                    }
                                }}
                                onLoad={() => handleImageLoad(index)}
                                src={url}
                                data-index={index}
                                alt={`Img ${index}`}
                                onClick={() => viewImage(url, index)} // Click to open image in full-screen
                                style={{ display: loaded ? 'block' : 'none' }}
                            />
                            {/* Delete Selection */}
                            <label
                                className='delete-button'
                                style={{ color: getColor(constUrl) }}
                                onClick={() => handleSelect(constUrl)}
                            >
                                <RiDeleteBinLine />
                            </label>
                        </div>
                    ))}
                    {/* Loading animation */}
                    {isLoading && 
                    <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
                }
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

export default DeletePhotos;
