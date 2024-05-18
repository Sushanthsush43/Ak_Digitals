import './../css/Upload.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL, updateMetadata, deleteObject } from 'firebase/storage';
import { toast } from "react-toastify";
import { toastSuccessStyle, toastErrorStyle } from './uitls/toastStyle.js';
import { VideoToFrames, VideoToFramesMethod } from './uitls/ThumbnailGenerator';

function VideoUpload({storage}) {

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

    async function revokeThumbnailUpload(thumbnailRef) {
        try {
          await deleteObject(thumbnailRef);
          console.log('Thumbnail revoked successfully');
        } catch (error) {
          if (error.code === 'storage/object-not-found') {
            console.log('The thumbnail you tried to delete does not exist.');
          } else {
            console.error('Error revoking thumbnail:', error);
          }
        }
      }

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

            let thumbnailRef; // needed as global for passing to revokeThumbnail function
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                try {
                    const thumbnail = await generateThumbnail(file);
                    const thumbnailName = file.name.slice(0, file.name.lastIndexOf('.')) + '.png';

                    if(thumbnail === null)
                        throw new Error(`Thumbnail creation failed for video ${file.name}`);
            
                    thumbnailRef = ref(storage, `thumbnails/${thumbnailName}`);
                    await uploadBytes(thumbnailRef, thumbnail, { contentType: 'image/png' });
            
                    const thumbnailUrl = await getDownloadURL(thumbnailRef);

                    const videoRef = ref(storage, `videos/${file.name}`);
            
                    const metadata = {
                        contentType: file.type,
                        customMetadata: {
                            thumbnailUrl: thumbnailUrl
                        }
                    };
                    await uploadBytes(videoRef, file, metadata);
            
                    // await updateMetadata(videoRef, metadata);
                } catch (error) {
                    await revokeThumbnailUpload(thumbnailRef); // Revoke video if upload fails
                    updatedArray[i] = false; // if upload failed, then set failed for that file
                    console.error(`Error uploading file "${file.name}":`, error);
                    isSomeFailed = true;
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
                toast.error("Some files could not be uploaded", {...toastErrorStyle(), autoClose:false}); // if some files couldn't be uploaded
            else if (!isCompleteFailed && !isSomeFailed)
                toast.success("Files successfully uploaded", {...toastSuccessStyle(), autoClose:false}); // if all files are uploaded
        }

    };

    const generateThumbnail = async (file) => {
        try {
          const videoUrl = URL.createObjectURL(file);
      
          const frames = await VideoToFrames.getFrames(videoUrl, 1, VideoToFramesMethod.totalFrames);
          const frameData = frames[0];
      
          // Remove the data URL prefix
          const base64WithoutPrefix = frameData.split(",")[1];
      
          // Decode the base64 string to binary data
          const binaryData = atob(base64WithoutPrefix);
      
          // Create an ArrayBuffer to store the binary data
          const arrayBuffer = new ArrayBuffer(binaryData.length);
      
          // Create a typed array to represent the binary data
          const uint8Array = new Uint8Array(arrayBuffer);
      
          // Fill the typed array with the binary data
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
      
          // Create a Blob object from the binary data
          const blob = new Blob([uint8Array], { type: 'image/png' });
      
          // Create an object URL for the Blob
          return blob;
        } catch (error) {
          console.error('Error generating thumbnail:', error);
          return null;
        }
      };
      
    return (

        <div className='mainBody'>
            <Link to="/" className="back-button"><i className="fas fa-arrow-left"></i></Link>

            <div className='wrapper'>
                <header>Upload videos</header>
                <form>
                    <label htmlFor="upload-input">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <p>Browse file to upload</p>
                    </label>
                    <input type="file" id="upload-input"
                     onClick={(e) => { if (uploading){
                        e.preventDefault();
                        toast.error("Please wait until the current files finish uploading.",toastErrorStyle()) }}}
                     onChange={handleFileChange} 
                     accept="video/*" 
                     multiple 
                     style={{ display: 'none' }} />
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

export default VideoUpload;
