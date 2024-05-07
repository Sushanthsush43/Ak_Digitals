import React, { useState, useEffect, useRef } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, listAll, getDownloadURL, connectStorageEmulator } from 'firebase/storage';
import { toast } from 'react-toastify';
import { toastErrorStyle } from '../components/uitls/toastStyle';


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

function Testing() {

  // Define state variables
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
 
    useEffect(() => {
        initialFetchImages(); // only once retreive all images from database
    }, []);

    async function initialFetchImages()
    {
        setIsLoading(true);
        try {
            const imageRefs_temp = await listAll(ref(storage, 'images')); // List items inside 'images' folder
            console.log(imageRefs_temp)
                const urls = await Promise.all(imageRefs_temp.items.map(async (itemRef) => {
                    try {
                        const url = await getDownloadURL(itemRef);
                        return {url , loaded:true};
                    } catch (error) {
                        console.error('Error getting download URL for itemRef:', error);
                        return null;
                    }
                }));
                setImageUrls(urls);
                console.log(imageUrls)
        } catch (error) {
            toast.error("Something went wrong, Please try again!", toastErrorStyle());
            console.error('Error listing items in storage:', error);
        } finally {
            setIsLoading(false);
        }        
    }

    useEffect(()=>
    {
        console.log("HERE",imageUrls)
    },[imageUrls])
    


  return (
        <>
            <div className={`photo-container`}>
                <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3 }}>
                <Masonry gutter='17px'>
                    {imageUrls.map(({ url, loaded }, index) => (
                    <img
                        key={index}
                        src={url}
                        alt={`Image ${index}`}
                        data-index={index}
                        // ref={(element) => {
                        // if (element && !loaded) {
                        //     if (!observer.current) {
                        //     observer.current = new IntersectionObserver(/* observer configuration */);
                        //     }
                        //     observer.current.observe(element); // Observe the element
                        // }
                        // }}

                        style={{ display: loaded ? 'inline' : 'none' }}
                    />
                    ))}
                </Masonry>
                </ResponsiveMasonry>
            </div>
            <div className='loading-viewMore' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                {/* Loading animation */}
                {isLoading && <div className='loading'></div>}

            </div>

        </>
  );
}

export default Testing;