import './../css/Upload.css';
import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { toast } from "react-toastify";
import { toastSuccessStyle, toastErrorStyle } from './uitls/toastStyle';
import ProgressBar from "@ramonak/react-progress-bar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import imageCompression from 'browser-image-compression';

// runCompleted is callback for tab component
function PhotoUpload({storage, runCompleted}) {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesCopy, setSelectedFilesCopy] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [allUploadDone, setAllUploadDone] = useState(false);
    const [uploadTrack, setUploadTrack] = useState(0);
    const [eachUpdated, setEachUpdated] = useState([]);
    const [abortController, setAbortController] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [compressionProgress, setCompressionProgress] = useState(0);
    const [uploadingFile, setUploadingFile] = useState('');
    let isSomeFailed = false;
    let isCompleteFailed = false;

    useEffect(() => {
        return () => {
            if (abortController) {
            abortController.abort();
            }
        };
    }, [abortController]);

    // round up progress value
    useEffect(() => {
    const prog = Math.abs(Math.round((compressionProgress + uploadProgress) / 2));
    if (prog > 100)
        setUploadProgress(100);
    else 
        setUploadProgress(prog);
    }, [compressionProgress, uploadProgress]);

    const handleFileChange = (e) => {
        setAllUploadDone(false);
        setSelectedFilesCopy([]);
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("No photo selected", toastErrorStyle());
            return;
        }
        if (selectedFiles.length > 100) {
            toast.error("Cannot upload more than 100 photos at once", toastErrorStyle());
            return;
        }
        setAllUploadDone(false);
        setUploading(true);
        isSomeFailed = false;
        isCompleteFailed = false;
        runCompleted(false);
        const controller = new AbortController();
        setAbortController(controller);

        try {
            const updatedArray = new Array(selectedFiles.length).fill(true); // set all file upload as successful initially
            setEachUpdated(updatedArray);
            setUploadTrack(selectedFiles.length);

            setSelectedFilesCopy(selectedFiles);

            const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                try {
                    setUploadingFile(file.name);
                    setCompressionProgress(0);
                    setUploadProgress(0);

                    // if component unmounts, cancel upload
                    if (controller.signal.aborted) {
                        return;
                    }

                    const options = {
                        maxSizeMB: 3,
                        maxWidthOrHeight: 1920,
                        useWebWorker: true,
                        onProgress: (progress) => {
                            setCompressionProgress(progress); // Update compression progress
                        }
                    };
                    const compressedFile = await imageCompression(file, options);

                    const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
                    if(!supportedExtensions.includes(fileExtension)) {
                        throw new Error('Invalid image format');
                    }
                    // if (i % 2 === 0) {
                    //     throw new Error('Simulated error: i equals 2');
                    // }
                        // throw new Error('Simulated error: i equals 2');


                    const storageRef = ref(storage, `images/${file.name}`);

                    // const metadata = {
                    //     contentType: file.type,
                    //     customMetadata: {
                    //         uploadTime: Date.now()
                    //     }
                    // };
                    await new Promise((resolve, reject) => {
                        const uplaodTask = uploadBytesResumable(storageRef, compressedFile);

                        uplaodTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            setUploadProgress(progress);
                        },
                        (error) => {
                            reject(error);
                        },
                        () => {
                            setUploadProgress(100);
                            resolve(); 
                        }
                        );
                    });
                    // console.log(`File "${file.name}" uploaded successfully.`);
                } catch (error) {
                    updatedArray[i] = false; // if upload failed, then set failed for that file
                    console.error(`Error uploading photo "${file.name}":`, error);
                    isSomeFailed = true;
                    // console.log("Error on ", i);
                } finally {
                    setUploadTrack(prevCount => prevCount - 1);
                }
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
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

            // console.log("Initial array:", eachUpdated);
            // const filteredArray = eachUpdated.filter(val => val === true);
            // console.log("Filtered array:", filteredArray);
            // console.log("Length of filtered array:", filteredArray.length);

            // display appropriate toast message
            if (!isCompleteFailed && isSomeFailed)
                toast.error("Some photos could not be uploaded", {...toastErrorStyle(), autoClose:false}); // if some files couldnt be uploaded
            else if (!isCompleteFailed && !isSomeFailed)
                toast.success("Photos successfully uploaded", {...toastSuccessStyle(), autoClose:false}); // if all files are uploaded

            // callback for tab component
            runCompleted(true);
        }

    };
    return (

        <div className='upload-mainBody'>
            {/* <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i></Link> */}

            <div className='upload-wrapper'>
                <header>Upload photos</header>
                <form className='upload-form'>
                    <label htmlFor="upload-input">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Browse file to upload</p>
                    </label>
                    <input type="file"
                     id="upload-input"
                     onClick={(e) => { if (uploading){
                        e.preventDefault();
                        toast.error("Please wait until the current photos finish uploading.",toastErrorStyle()) }}}
                     onChange={handleFileChange} 
                     accept="image/*" 
                     multiple 
                     style={{ display: 'none' }} />
                </form>
                {selectedFiles.length > 0 ? (
                    <>
                        No of selected Files : <strong>{selectedFiles.length}</strong>
                    </>
                ) : ('')}

                <section className="upload-progress-area">

                    <button onClick={handleUpload} className='upload-button' type="submit" disabled={uploading}>
                        {uploading ? <>Uploading <FontAwesomeIcon icon={faSpinner} spin /></>: 'Upload'}
                    </button>
                    {/* {uploading && <div className="upload-loading-animation">Uploading...</div>} */}
                    {uploading && 
                        <div>
                            <div className='upload-filename-text'>{uploadingFile}</div>
                            <ProgressBar 
                             completed={uploadProgress} 
                             height='17px' 
                             customLabel={`${uploadProgress.toFixed(0)}`}
                             bgColor="#850F8D"
                            //  baseBgColor="#ffff"
                             labelColor="#ffff" />
                        </div>
                    }

                    <div className="remaing-css" style={{ marginTop: '10px' }}>
                        Remaining : <strong>{uploadTrack}</strong>
                    </div>

                    <div className="failed-uploads-container">
                    {allUploadDone &&
                        eachUpdated.map((value, i) => value !== true ?
                            <div className='failed-file-upload' style={{ backgroundColor: "red", display: "flex" }}
                            key={`${i}-failed-img-upload`}>
                                {/* display these in row style */}
                                <div className='failed-upload-file-name'>{selectedFilesCopy[i].name}</div>
                                <div>Failed</div>
                            </div>
                            : null
                        )
                    }
                    </div>
                </section>
            </div>
        </div>

    );
}

export default PhotoUpload;