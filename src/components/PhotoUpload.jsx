import './../css/Upload.css';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ref, uploadBytes } from 'firebase/storage';
import { toast } from "react-toastify";
import { toastSuccessStyle, toastErrorStyle } from './uitls/toastStyle';
import { CheckAdminLogin } from './uitls/checkAdminLogin';
import { useHistory } from 'react-router-dom';

function PhotoUpload({storage,app}) {

    // Check admin Login  section ====================================================
    const { isAdminLoggedIn, adminLoading } = CheckAdminLogin(app);
    const history = useHistory();

    useEffect(()=>{
        if (!isAdminLoggedIn) {
            history.push('/'); // Redirect to home page if admin is not logged in
        }
    },[adminLoading]);
    // ===============================================================================

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesCopy, setSelectedFilesCopy] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [allUploadDone, setAllUploadDone] = useState(false);
    const [uploadTrack, setUploadTrack] = useState(0);
    const [eachUpdated, setEachUpdated] = useState([]);
    let isSomeFailed = false;
    let isCompleteFailed = false;

    const handleFileChange = (e) => {
        setAllUploadDone(false);
        setSelectedFilesCopy([]);
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("No files selected", toastErrorStyle());
            return;
        }
        setAllUploadDone(false);
        setUploading(true);
        isSomeFailed = false;
        isCompleteFailed = false;

        try {
            const updatedArray = new Array(selectedFiles.length).fill(true); // set all file upload as successful initially
            setEachUpdated(updatedArray);
            setUploadTrack(selectedFiles.length);

            setSelectedFilesCopy(selectedFiles);

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                try {
                    // if (i % 2 === 0) {
                    //     throw new Error('Simulated error: i equals 2');
                    // }

                    const storageRef = ref(storage, `images/${file.name}`);
                    await uploadBytes(storageRef, file);
                    // console.log(`File "${file.name}" uploaded successfully.`);
                } catch (error) {
                    updatedArray[i] = false; // if upload failed, then set failed for that file
                    console.error(`Error uploading file "${file.name}":`, error);
                    isSomeFailed = true;
                    // console.log("Error on ", i);
                } finally {
                    setUploadTrack(prevCount => prevCount - 1);
                }
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error("Something went wrong, Please try again.", {...toastErrorStyle(), autoClose:false});
            isCompleteFailed = true;
            return;
        } finally {
            setUploading(false);
            setAllUploadDone(true);
            setSelectedFiles([]);

            // Reset input element
            const fileInput = document.getElementById('upload-input');
            fileInput && (fileInput.value = '');

            // display appropriate toast message
            if (!isCompleteFailed && isSomeFailed)
                toast.error("Some files could not be uploaded", {...toastErrorStyle(), autoClose:false}); // if some files couldnt be uploaded
            else if (!isCompleteFailed && !isSomeFailed)
                toast.success("Files successfully uploaded", {...toastSuccessStyle(), autoClose:false}); // if all files are uploaded
        }

    };
    return (

        <div className='mainBody'>
            <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i></Link>

            <div className='wrapper'>
                <header>Upload photos</header>
                <form>
                    <label htmlFor="upload-input">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Browse file to upload</p>
                    </label>
                    <input type="file" id="upload-input" onChange={handleFileChange} accept="image/*" multiple style={{ display: 'none' }} />
                </form>
                {selectedFiles.length > 0 ?
                     selectedFiles.length : ''}

                <section className="progress-area">

                    <button onClick={handleUpload} className="upload-button">Upload</button>
                    {uploading && <div className="upload-loading-animation">Uploading...</div>}
                    <div className="remaing-css" style={{ marginTop: '10px' }}>
                        <span>Remaining: {uploadTrack}</span>
                    </div>

                    {allUploadDone &&
                        eachUpdated.map((value, i) => value !== true ?
                            <div className='failed-file-upload' style={{ backgroundColor: "red", display: "flex" }} key={i}>
                                {/* display these in row style */}
                                <div>{selectedFilesCopy[i].name}</div>
                                <div>Failed</div>
                            </div>
                            : null
                        )
                    }
                </section>
            </div>
        </div>

    );
}

export default PhotoUpload;