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
      background: '#F5F5F5',
      color: '#000',
      fontWeight: 'bold',
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      margin: '7px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '7px',
      borderRadius: '20px',
      boxShadow: '0px 10px 20px rgba(133, 15, 141, 0.5)'
    },
    icon: <FcApproval style={{ color: '#FCAF45', width: '60px', height: '55px' }} />,
    progressClassName: 'toast-success-progress-bar'
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
      background: '#F5F5F5',
      color: '#000',
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
