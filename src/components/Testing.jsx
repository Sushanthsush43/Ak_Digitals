import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, list, getDownloadURL } from 'firebase/storage';

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

const ImageGallery = () => {
    const [images, setImages] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = () => {
        let query = ref(storage, 'images').list({
            maxResults: 10
        });

        if (lastVisible) {
            query = query.startAfter(lastVisible);
        }

        query.then((result) => {
            setImages(prevImages => [...prevImages, ...result.items]);
            if (result.items.length > 0) {
                setLastVisible(result.items[result.items.length - 1]);
            }
        }).catch((error) => {
            console.error('Error fetching images:', error);
        });
    };

    const loadMoreImages = () => {
        fetchImages();
    };

    return (
        <div>
            <div className="image-gallery">
                {images.map((image, index) => (
                    <img key={index} src={getDownloadURL(image)} alt={`Image ${index}`} />
                ))}
            </div>
            <button onClick={loadMoreImages}>Load More</button>
        </div>
    );
};

export default ImageGallery;
