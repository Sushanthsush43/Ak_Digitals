import '../../css/Upload.css';
import { useState } from 'react';
import { toast } from "react-toastify";
import { toastSuccessStyle, toastErrorStyle } from '../utils/toastStyle.js';
import ProgressBar from "@ramonak/react-progress-bar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { doc, setDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";

function VideoUpload({firestore, runCompleted}) {

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesCopy, setSelectedFilesCopy] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [allUploadDone, setAllUploadDone] = useState(false);
    const [uploadTrack, setUploadTrack] = useState(0);
    const [eachUpdated, setEachUpdated] = useState(new Map());
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadingFile, setUploadingFile] = useState('');
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
            toast.error("No video selected", toastErrorStyle());
            return;
        }
        if (selectedFiles.length > 25) {
            toast.error("Cannot upload more than 25 videos at once", toastErrorStyle());
            return;
        }
        setAllUploadDone(false);
        setUploading(true);
        isSomeFailed = false;
        isCompleteFailed = false;
        runCompleted(false);
        setUploadingFile('');
        let totalUploadedSize = 0;
        let totalUploadedCount = 0;

        const updatedMap = new Map();
        for (let i = 0; i < selectedFiles.length; i++)
            updatedMap.set(i, { success: true, error: "" });
        try {
            setEachUpdated(new Map(updatedMap));
            setUploadTrack(selectedFiles.length);
            setSelectedFilesCopy(selectedFiles);

            const supportedExtensions = ['mp4', 'webm', 'ogg', 'mpg', 'mov', 'avi', 'mpeg'];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                try {
                    setUploadingFile(file.name);
                    setUploadProgress(0);

                    const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();
                    if (!supportedExtensions.includes(fileExtension)) {
                        updatedMap.set(i, { success: false, error: "Invalid video format" });
                        console.error(`Skipping upload "${file.name}" - invalid video format`);
                        isSomeFailed = true;
                        continue;
                    }

                    if (file.size > 99 * 1024 * 1024) {
                        updatedMap.set(i, { success: false, error: "Exceeds 99MB size limit" });
                        console.error(`Skipping upload "${file.name}" - too large`);
                        isSomeFailed = true;
                        continue;
                    }

                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", process.env.REACT_APP_VIDEO_UPLOAD_PRESET);

                    const xhr = new XMLHttpRequest();

                    await new Promise((resolve, reject) => {
                        xhr.open("POST", "https://api.cloudinary.com/v1_1/" + 
                            process.env.REACT_APP_CLOUDINARY_CLOUD_NAME + "/video/upload");

                        xhr.upload.onprogress = (event) => {
                            if (event.lengthComputable) {
                                const progress = (event.loaded / event.total) * 100;
                                setUploadProgress(progress);
                            }
                        };

                        xhr.onload = async () => {
                            if (xhr.status === 200) {
                                const response = JSON.parse(xhr.responseText);

                                const videoUrl = response.secure_url;
                                const publicId = response.public_id;
                                const bytes = response.bytes;
                                const deleteToken = response.delete_token; // Valid only for 10 mins, used for exception case
                                try {
                                    // store video url and other metadata in firestore for later use
                                    await addDoc(collection(firestore, "videos"), {
                                        public_id: publicId,
                                        name: file.name,
                                        url: videoUrl,
                                        size: bytes,
                                        createdAt: serverTimestamp()
                                    });
                                    console.log(`Video uploaded successfully: ${file.name}`);

                                    // keep track of usage for usage collection
                                    totalUploadedSize += bytes;
                                    totalUploadedCount += 1;
                                    } catch (firestoreError) {
                                        // rollback Cloudinary upload, if firestore metadata uplaod failed
                                        if (deleteToken) {
                                            await fetch(
                                                "https://api.cloudinary.com/v1_1/" +
                                                process.env.REACT_APP_CLOUDINARY_CLOUD_NAME +
                                                "/delete_by_token",
                                                {
                                                    method: "POST",
                                                    headers: {"Content-Type": "application/json"},
                                                    body: JSON.stringify({token: deleteToken})
                                                }
                                            );
                                        }
                                        reject(firestoreError);
                                    }

                                setUploadProgress(100);
                                resolve();
                            } else {
                                reject(new Error("Upload failed"));
                            }
                        };

                        xhr.onerror = () => reject(new Error("Upload error"));
                        xhr.send(formData);
                    });

                } catch (error) {
                    updatedMap.set(i, {
                        success: false,
                        error: error.message || "Upload failed"
                    });
                    console.error(`Error uploading video "${file.name}":`, error);
                    isSomeFailed = true;
                } finally {
                    setUploadTrack(prevCount => prevCount - 1);
                }
                await delay(1000);
            }
        } catch (error) {
            console.error('Error uploading videos:', error);
            toast.error("Something went wrong, Please try again.", {...toastErrorStyle(), autoClose:false});
            isCompleteFailed = true;
            return;
        } finally {
            // upload usage statistics to firebase
            if (totalUploadedCount > 0) {
                try {
                    const statsRef = doc(firestore, "usage_stats", "media");
                    await setDoc(statsRef, {
                        vid_count: increment(totalUploadedCount),
                        vid_total_size: increment(totalUploadedSize),
                        total_size: increment(totalUploadedSize),
                        last_updated: serverTimestamp()
                    }, { merge: true });
                    console.log("Usage Statistics Updated");
                } catch (err) {
                    console.error("Usage Statistics update failed:", err);
                }
            }
            setUploading(false);
            setAllUploadDone(true);
            setSelectedFiles([]);
            setEachUpdated(new Map(updatedMap)); // trigger error UI

            const fileInput = document.getElementById('upload-input');
            fileInput && (fileInput.value = '');

            if (!isCompleteFailed && isSomeFailed)
                toast.error("Some videos could not be uploaded", {...toastErrorStyle(), autoClose:false});
            else if (!isCompleteFailed && !isSomeFailed)
                toast.success("Videos successfully uploaded", {...toastSuccessStyle(), autoClose:false});

            runCompleted(true);
        }
    };

    return (
        <div className='upload-mainBody'>
            <div className='upload-wrapper'>
                <header>Upload videos</header>
                <form className='upload-form'>
                    <label htmlFor="upload-input">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Browse file to upload</p>
                    </label>
                    <input type="file" id="upload-input"
                     onClick={(e) => { if (uploading){
                        e.preventDefault();
                        toast.error("Please wait until the current files finish uploading.",toastErrorStyle()) }}
                     }
                     onChange={handleFileChange} 
                     accept="video/*" 
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
                    {uploading && 
                        <div>
                            <div className='upload-filename-text'>{uploadingFile}</div>
                            <ProgressBar 
                             completed={uploadProgress}
                             height='17px'
                             customLabel={`${uploadProgress.toFixed(0)}`}
                             bgColor="#850F8D"
                             labelColor="#ffff" />
                        </div>
                    }
                    <div className="remaing-css" style={{ marginTop: '10px' }}>
                        Remaining : <strong>{uploadTrack}</strong>
                    </div>
                    <div className="failed-uploads-container">
                    {allUploadDone &&
                        Array.from(eachUpdated.entries()).map(([i, value]) => !value.success ?
                            <div className='failed-file-upload' style={{ backgroundColor: "red", display: "flex" }} 
                            key={`${i}-failed-vid-upload`}>
                                <div className='failed-upload-file-name'><b>Name: </b>{selectedFilesCopy[i].name}</div>
                                <div className='failed-upload-error-text'><b>Error: </b>{value.error}</div>
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

export default VideoUpload;