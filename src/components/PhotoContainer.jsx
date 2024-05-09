import React, { useState, useEffect, useRef } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/uitls/toastStyle';
import { InView } from "react-intersection-observer";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

function PhotoContainer() {

  // Define state variables
  const [isOpened, setIsOpened] = useState(false);
  const [data, setData] = useState({ img: '', i: 0 });
  const [imageUrls, setImageUrls] = useState([]);
  const [page, setPage] = useState(1);
  const imagesPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [moreCount, setMoreCount] = useState(0);
  const [imageRefs, setImageRefs] = useState([]);

//   const { ref, inView } = useInView({
//     triggerOnce: true, // Load the image only once
//     rootMargin: '100px', // Adjust the root margin as per your requirement
//   });


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
    
                const urls = await Promise.all(imageRefs.items.slice(startIndex, endIndex).map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        return { url, loaded: false };
                    } catch (error) {
                        console.error('Error getting download URL for itemRef:', error);
                        return null;
                    }
                }));
    
                // If it's the last page, reset the page count
                if (page === totalPages) {
                    setPage(1);
                    setMoreCount(0);
                }
    
                // if viewMoreCount >= 3, then replace old images with new ones, else add to the div
                // if (moreCount >= 3) {
                    // setImageUrls(urls.filter(item => item !== null));
                    // setMoreCount(0);
                // } else {
                    setImageUrls(prevUrls => [...prevUrls, ...urls.filter(url => url !== null)]);
                // }
            } catch (error) {
                toast.error("Something went wrong, Please try again!",toastErrorStyle());
                console.error('Error listing items in storage:', error);
            } finally {
                setIsLoading(false);
            }
        } 
    }

    const handleViewMore = () => {
        setPage(prevPage => prevPage + 1);
        setMoreCount(prevCount => prevCount + 1);
    };

    const handleImageLoad = (index) => {
        setImageUrls(prevImageUrls => {
            const updatedImageUrls = [...prevImageUrls];
            updatedImageUrls[index].loaded = true; // Mark image as loaded
            return updatedImageUrls;
        });
    };

  return (
        <>
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
            </>
            <div className={`photo-container ${isOpened ? 'animate' : ''}`} >
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3 }}>
                <Masonry gutter='17px'>
                    {imageUrls.map(({ url, loaded }, index) => (
                        <InView
                        as="img"
                            key={index}
                            onChange={(inView) => {inView && loaded ? url=url : url = ''}}
                            onLoad={() => handleImageLoad(index)}
                            src={url}
                            alt={`Image ${index}`}
                            data-index={index}
                            onClick={() => viewImage(url, index)} // Click to open image in full-screen
                            style={{ display: loaded ? 'inline' : 'none' }}
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
                {imageUrls.length > 0 && (
                <InView
                    as="div"
                    onChange={(inView) => inView? handleViewMore()  : ''}
                    style={{
                    position: 'relative',
                    width: '100px',
                    height:'25px'
                    }}
                >
                    <div className='line'></div>

                </InView>
                )}
            </div>

        </>
  );
}

export default PhotoContainer;