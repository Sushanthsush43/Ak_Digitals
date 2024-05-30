import { ref, listAll, getMetadata } from 'firebase/storage';

export const getDashboardData = async (storage) => {

    const convertBytesToGb = (bytes) => {
        return bytes / (1024 * 1024 * 1024);
    };
    try{
        // Image section
        const imgRefsTemp = await listAll(ref(storage, 'images'));
        const imgRefs = imgRefsTemp.items;
        const imgsSizes = await Promise.all(
        imgRefs.map(async (imgRef) => {
            const metadata = await getMetadata(imgRef);
            return metadata.size;
        }));
        const imgsSizeTotalMainBytes = imgsSizes.reduce((accumulator, currentValue) => accumulator  + currentValue, 0);
        const imgsSizeTotalMainGB = convertBytesToGb(imgsSizeTotalMainBytes);

        // Video section
        const vidRefsTemp = await listAll(ref(storage, 'videos'));
        const vidRefs = vidRefsTemp.items;
        const vidsSizes = await Promise.all(
        vidRefs.map(async (vidRef) => {
            const metadata = await getMetadata(vidRef);
            return metadata.size;
        }));
        const vidsSizeTotalBytes = vidsSizes.reduce((accumulator, currentValue) => accumulator  + currentValue, 0);
        
        // Thumbnail section
        const thumbnailsRefsTemp = await listAll(ref(storage, 'thumbnails'));
        const thumbnailsRefs = thumbnailsRefsTemp.items;
        const thumbnailsSizes = await Promise.all(
        thumbnailsRefs.map(async (thumbnailRef) => {
            const metadata = await getMetadata(thumbnailRef);
            return metadata.size;
        }));
        const thumbnailsSizeTotalBytes = thumbnailsSizes.reduce((accumulator, currentValue) => accumulator  + currentValue, 0);

        // Thumbnails and Videos are considered togethor
        const vidsSizeTotalMainBytes = vidsSizeTotalBytes + thumbnailsSizeTotalBytes;
        const vidsSizeTotalMainGB = convertBytesToGb(vidsSizeTotalMainBytes);

        const totalSizeUsedBytes = imgsSizeTotalMainBytes + vidsSizeTotalMainBytes;
        const totalSizeUsedGB = convertBytesToGb(totalSizeUsedBytes);

        return { imgsLength : imgRefs.length,
                 vidsLength : vidRefs.length,
                 imgSize : imgsSizeTotalMainGB,
                 vidSize : vidsSizeTotalMainGB,
                 totalUsedSize : totalSizeUsedGB 
                };

    }catch(error){
        console.log("Something went wrong while getting dashboard data :", error);
        return null;
    }
}