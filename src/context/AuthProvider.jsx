import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import the separate context file to fix the Vite Fast Refresh warning
import { AuthContext } from './AuthContext';
// Connect directly to the custom mock variables
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  signOut 
} from '../firebase/firebase.config';

// Mock Classes to prevent initialization errors in Login.jsx
class GoogleAuthProvider {}
class FacebookAuthProvider {}
const googleProvider = new GoogleAuthProvider();
const FacebookProvider = new FacebookAuthProvider();

// Mock listener that evaluates the active session user object state
const onAuthStateChanged = (authInstance, callback) => {
  callback(authInstance.currentUser);
  return () => {}; // return clean empty cleanup function
};

// Optional mock implementations to bypass network exceptions
const updateProfile = async (user, data) => {
  if (auth.currentUser) auth.currentUser.displayName = data.displayName;
};
const sendPasswordResetEmail = async () => true;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const state = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email) {
        const userData = { email: currentUser.email };
        // Attempts token generation on your local backend process
        axios.post('http://localhost:4000/jwt', userData)
          .then(res => {
            localStorage.setItem('token', res.data.token);
            console.log('Token successfully generated after JWT update:', res.data);
          })
          .catch(err => {
            console.log('JWT Server connection offline, writing temporary fallback token metrics.');
            localStorage.setItem('token', 'mocked_local_development_jwt_string_token');
          });
      }
    });
    return () => {
      state();
    };
  }, []);

  // Register user locally
  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
      setUser(res.user);
      return res;
    });
  };

  // Handle Signin locally
  const userSignin = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password).then((res) => {
      setUser(res.user);
      return res;
    });
  };

  // Handle logout locally
  const logOut = () => {
    return signOut(auth).then(() => {
      setUser(null);
      localStorage.removeItem('token');
    }).catch((error) => {
      console.log(error);
    });
  };

  // Sign in with Google mock routing
  const googleSignIn = () => {
    return signInWithPopup(auth, googleProvider).then((res) => {
      setUser(res.user);
      return res;
    });
  };

  // Sign in with Facebook mock routing
  const facebookSignIn = () => {
    return signInWithPopup(auth, FacebookProvider).then((res) => {
      setUser(res.user);
      return res;
    });
  };

  // Update user profile parameters mock
  const updateUser = (name, photoUrl) => {
    return updateProfile(auth.currentUser, {
      displayName: name, photoURL: photoUrl
    });
  };

  // Send Password Reset Email mock routing
  const passwordResetEmail = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const userInfo = {
    user,
    setUser,
    createUser,
    logOut,
    userSignin,
    googleSignIn,
    facebookSignIn,
    updateUser,
    passwordResetEmail
  };

  return <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
