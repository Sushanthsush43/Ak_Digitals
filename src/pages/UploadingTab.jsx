import React, { useState } from "react";
import Video from "../components/VideoUpload";
import Photo from "../components/PhotoUpload";
import './../css/UploadingTab.css';

export default function UploadTab() {
    const [activeTab, setActiveTab] = useState("photo");

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <>
            <div style={{ padding:'125px',marginLeft: "10px", marginRight: "10px", backgroundColor:'#F5F5F5'}}>
                <div className="tabs-container">
                    <div className="tabs">
                        <button className={`upload-photo ${activeTab === "photo" ? "active" : ""}`} onClick={() => handleTabClick("photo")}>Upload Photos</button>
                        <button className={`upload-videos ${activeTab === "video" ? "active" : ""}`} onClick={() => handleTabClick("video")}>Upload Videos</button>
                    </div>
                    <div className="tab-content">
                        {activeTab === "photo" && <Photo />}
                        {activeTab === "video" && <Video />}
                    </div>
                </div>
            </div>
        </>
    );
}
