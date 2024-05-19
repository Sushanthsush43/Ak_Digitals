import { FcApproval, FcCancel } from "react-icons/fc";

export const toastSuccessStyle = () => {
  return {
    position: 'top-center',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      background: '#3F2305',
      color: '#F5F5F5',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      margin: '7px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '7px',
      borderRadius: '20px',
      boxShadow: '0px 10px 20px rgba(255, 75, 43, 0.4)'
    },
    icon: <FcApproval style={{ color: '#FCAF45', width: '60px', height: '55px' }} />
  };
};


export const toastErrorStyle = () => {
  return {
    position: 'top-center',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    style: {
      background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      margin: '7px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '7px',
      borderRadius: '20px',
      boxShadow: '0px 10px 20px rgba(255, 75, 43, 0.4)'
    },
    icon: <FcCancel style={{ color: '#FCAF45', width: '60px', height: '55px' }} />

  };
};
