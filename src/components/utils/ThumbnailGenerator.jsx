import React, { useState, useEffect } from 'react';

// Define VideoToFramesMethod enum
export const VideoToFramesMethod = {
  fps: 'fps',
  totalFrames: 'totalFrames'
};

// Define VideoToFrames class
export class VideoToFrames {
  static getFrames(videoUrl, amount, type = VideoToFramesMethod.fps) {
    return new Promise((resolve, reject) => {
      let frames = [];
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      let duration;

      let video = document.createElement("video");
      video.preload = "auto";

      video.addEventListener("loadeddata", async function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        duration = video.duration;

        let totalFrames = amount;
        if (type === VideoToFramesMethod.fps) {
          totalFrames = duration * amount;
        }
        for (let time = 0; time < duration; time += duration / totalFrames) {
          frames.push(await VideoToFrames.getVideoFrame(video, context, canvas, time));
        }
        resolve(frames);
      });

      video.src = videoUrl;
      video.load();
    });
  }

  static getVideoFrame(video, context, canvas, time) {
    return new Promise((resolve, reject) => {
      let eventCallback = () => {
        video.removeEventListener("seeked", eventCallback);
        VideoToFrames.storeFrame(video, context, canvas, resolve);
      };
      video.addEventListener("seeked", eventCallback);
      video.currentTime = time;
    });
  }

  static storeFrame(video, context, canvas, resolve) {
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    resolve(canvas.toDataURL());
  }
}

function ThumbnailGenerator({ file }) {
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    if (file) {
      generateThumbnail(file);
    }
  }, [file]);

  const generateThumbnail = async (file) => {
    const videoUrl = URL.createObjectURL(file);
    try {
      const frames = await VideoToFrames.getFrames(videoUrl, 1, VideoToFramesMethod.totalFrames);
      setThumbnail(frames[0]);
    } catch (error) {
      console.error('Error generating thumbnail:', error);
    }
  };

  return (
    <div>
      {thumbnail && <img src={thumbnail} alt="Thumbnail" style={{display:'none'}}/>}
    </div>
  );
}

export default ThumbnailGenerator;