import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';

let cachedFirebaseApp; // Cache the initialized Firebase app

export const getFirebaseConfig = () => {
    if (cachedFirebaseApp) {
        // If the Firebase app is already initialized, return the cached app
        return cachedFirebaseApp;
    }

    const firebaseConfig = {
        apiKey: process.env.REACT_APP_API_KEY,
        authDomain: process.env.REACT_APP_AUTH_DOMAIN,
        projectId: process.env.REACT_APP_PROJECT_ID,
        storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
        messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
        appId: process.env.REACT_APP_APP_ID,
        measurementId: process.env.REACT_APP_MEASUREMENT_ID
    };

    const app = initializeApp(firebaseConfig);
    // const analytics = getAnalytics(app);
    const storage = getStorage(app);

    // Cache the initialized Firebase app
    cachedFirebaseApp = { storage, app };

    return cachedFirebaseApp;
}
