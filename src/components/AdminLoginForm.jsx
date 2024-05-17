import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { toastErrorStyle, toastSuccessStyle } from './uitls/toastStyle';

function AdminLoginForm({ app }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email Cannot be empty", toastErrorStyle());
      return;
    }

    if (!password.trim()) {
      toast.error("Password Cannot be empty", toastErrorStyle());
      return;
    }

    try {
      const auth = getAuth(app);

      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Admin Login Successfull", toastSuccessStyle());
      console.log('Admin logged in successfully!');
    } catch (error) {
      toast.error("Invalid Login Credentials", toastErrorStyle());
      console.error('Error signing in:', error.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email Cannot be empty", toastErrorStyle());
      return;
    }

    try {
      const auth = getAuth(app);

      await sendPasswordResetEmail(auth, email);

      toast.success("Success! If your email is registered, you'll receive a password reset link soon. Please check your inbox.",
      {...toastSuccessStyle(), autoClose : false} );
      console.log('Password reset email sent.');

      setIsButtonDisabled(true);
      setTimeout(() => {
        setIsButtonDisabled(false);
      }, 5000); // 5 sec
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again later.", toastErrorStyle());
      console.error('Error sending password reset email:', error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value.trim())}
        />
        <button type="submit">Login</button>
      </form>
      <button disabled={isButtonDisabled} onClick={handleForgotPassword}>
        Forgot Password?
      </button>
    </div>
  );
}

export default AdminLoginForm;