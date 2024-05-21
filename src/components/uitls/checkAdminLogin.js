import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useHistory } from 'react-router-dom';

export const CheckAdminLogin = ({ app, getBool = false }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);
  const history = useHistory();
  
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
  }, [app]);

  useEffect(() => {
    if (!adminLoading && !isAdminLoggedIn && !getBool) {
      history.push('/'); // Redirect to home page if admin is not logged in
    }
  }, [isAdminLoggedIn, adminLoading, getBool, history]);

  if (getBool)
    return { isAdminLoggedIn, adminLoading };
  else
    return null;
  
}
