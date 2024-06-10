import React from 'react';
import { toast } from 'react-toastify';
import { toastErrorStyle, toastSuccessStyle } from './utils/toastStyle';
import { getAuth, signOut } from 'firebase/auth';

function AdminLogout({ app, closeStatus }) {

  const handleLogout = async () => {
    try {
        const auth = getAuth(app);
        await signOut(auth);

        // signal to close component
        closeStatus(true);
        console.log('Logout Successfull');
        toast.success("Logout Successfull", toastSuccessStyle());
      } catch (error) {
        console.error('Error logging out:',  error.message || error);
        toast.error("Something went wrong, Please try again.", toastErrorStyle());
        closeStatus(false);
      }
  };

  return (
    <>
        <button className='logout-btn' onClick={handleLogout}>Logout</button>
    </>
  );
}

export default AdminLogout;