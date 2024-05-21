export function isIOSorMacDevice() {
    try{
        const userAgent = navigator.userAgent;

        // if IOS platform then will return true, or else will return false
        return userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('Macintosh');

    }catch(error){
        console.log("Error while identifying platform :", error)
        return true; // return true just for safety , we will assume its IOS
    }
}

export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
  }
  