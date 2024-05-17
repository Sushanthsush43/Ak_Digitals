import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CheckAdminLogin = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user)
        setIsAdminLoggedIn(true);
      else
        setIsAdminLoggedIn(false);
    });

    return () => unsubscribe();
  }, []);

  const redirectToOtherPage = () => {
    if (!isAdminLoggedIn) {
      history.push('/'); // Redirect to home page if admin is not logged in
    }
  };

  return redirectToOtherPage;
};

export default CheckAdminLogin;