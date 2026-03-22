import { doc, getDoc } from "firebase/firestore";

export const getDashboardData = async (firestore) => {
    const convertBytesToGb = (bytes) => {
        return parseFloat(bytes / (1024 * 1024 * 1024)).toFixed(2);
    };

    try {
        const statsRef = doc(firestore, "usage_stats", "media");
        const statsSnap = await getDoc(statsRef);

        if (!statsSnap.exists()) {
            return {
                imgsLength: 0,
                vidsLength: 0,
                imgSize: "0.00",
                vidSize: "0.00",
                totalUsedSize: "0.00"
            };
        }

        const data = statsSnap.data();

        return {
            imgsLength: data.img_count || 0,
            vidsLength: data.vid_count || 0,
            imgSize: convertBytesToGb(data.img_total_size || 0),
            vidSize: convertBytesToGb(data.vid_total_size || 0),
            totalUsedSize: convertBytesToGb(data.total_size || 0)
        };

    } catch (error) {
        console.log("Something went wrong while getting dashboard data :", error);
        return null;
    }
};