import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export const CheckAdminLogin = ({app}) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribeAuthListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdminLoggedIn(true);
      } else {
        setIsAdminLoggedIn(false);
      }
      setAdminLoading(false);
    });

    return unsubscribeAuthListener;
  }, []);

  return { isAdminLoggedIn, adminLoading };
}