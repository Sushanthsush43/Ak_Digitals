import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from 'react-icons/fa';
import { GrInstagram } from "react-icons/gr";
import './../css/ContactPage.css';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const ContactPage = () => {
    const [aboutText, setAboutText] = useState([]);
    const [editedAboutText, setEditedAboutText] = useState([]);
    const [photoSrc, setPhotoSrc] = useState([]);
    const [editedPhoto, setEditedPhoto] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedAboutText(aboutText);
    };

    const handleSave = async () => {
        setIsEditing(false);
        setAboutText(editedAboutText);
        if (editedPhoto) {
            const storageRef = ref(storage, editedPhoto.name);
            await uploadBytes(storageRef, editedPhoto);
            const photoUrl = await getDownloadURL(storageRef);
            setPhotoSrc(photoUrl);
        }
        //logic 
    };

    return (
        <div className="about-page">
            <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i></Link>
            <div className="photo-containers">
                {isEditing ? (
                    <input type="file" onChange={(e) => setEditedPhoto(e.target.files[0])} />
                ) : (
                    <img src={photoSrc} alt="About" />
                )}
            </div>
            <div className="about-content">
                {isEditing ? (
                    <textarea
                        value={editedAboutText}
                        onChange={(e) => setEditedAboutText(e.target.value)}
                        rows={5} style={{ borderRadius: '5%' }}
                    />
                ) : (
                    <p>{aboutText}</p>
                )}
                <div className="contact-info">
                    <div className="social-media">
                        <a href="your_facebook_link">
                            <FaFacebook style={{ color: '#1877F2', width: '40px', height: '35px' }} />
                        </a>
                        <a href="https://www.instagram.com/abhi.devadi?igsh=MW1pdGcxcjhpZzRiNA==">
                            <GrInstagram style={{ color: '#FCAF45', width: '40px', height: '35px' }} />
                        </a>
                    </div>
                    <p>Phone: +917619541855,<br />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+917619541855
                    </p>

                    <p>Email: ak97.digital@gmail.com</p>
                </div>
                {isEditing ? (
                    <button onClick={handleSave} style={{ width: '90px', height: '40px', background: '#3E3232', color: '#F6F5F2', borderRadius: '10%' }}>Save</button>
                ) : (
                    <button onClick={handleEdit} style={{ width: '90px', height: '40px', background: '#3E3232', color: '#F6F5F2', borderRadius: '10%' }}>Edit</button>
                )}
            </div>
        </div>
    );
}

export default ContactPage;
