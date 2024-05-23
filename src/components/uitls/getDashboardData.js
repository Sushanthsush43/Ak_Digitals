import { ref, listAll, getMetadata } from 'firebase/storage';

export const getDashboardData = async (storage) => {
    try{
        const imgRefsTemp = await listAll(ref(storage, 'images'));
        const imgRefs = imgRefsTemp.items;
        const imgsSizes = await Promise.all(
        imgRefs.map(async (imgRef) => {
            const metadata = await getMetadata(imgRef);
            return metadata.size;
        }));
        const imgsSizeTotalMain = imgsSizes.reduce((accumulator, currentValue) => accumulator  + currentValue, 0);

        const vidRefsTemp = await listAll(ref(storage, 'videos'));
        const vidRefs = vidRefsTemp.items;
        const vidsSizes = await Promise.all(
        vidRefs.map(async (vidRef) => {
            const metadata = await getMetadata(vidRef);
            return metadata.size;
        }));
        const vidsSizeTotal = vidsSizes.reduce((accumulator, currentValue) => accumulator  + currentValue, 0);
        

        const thumbnailsRefsTemp = await listAll(ref(storage, 'thumbnails'));
        const thumbnailsRefs = thumbnailsRefsTemp.items;
        const thumbnailsSizes = await Promise.all(
        thumbnailsRefs.map(async (thumbnailRef) => {
            const metadata = await getMetadata(thumbnailRef);
            return metadata.size;
        }));
        const thumbnailsSizeTotal = thumbnailsSizes.reduce((accumulator, currentValue) => accumulator  + currentValue, 0);

        const vidsSizeTotalMain = vidsSizeTotal + thumbnailsSizeTotal;

        return { imgsLength : imgRefs.length, vidsLength : vidRefs.length };

    }catch(error){
        console.log("Something went wrong while getting dashboard data :", error);
        return null;
    }
}