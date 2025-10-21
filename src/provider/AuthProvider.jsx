import React, {  useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import AuthContext from "../provider/AuthContext"
import GoogleProvider from "./GoogleProvider"

import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import GitHubProvider from "./GitHubProvider";

const auth = getAuth(app);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // console.log(loading, user);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signInWithGoogle=()=>{
    return signInWithPopup(auth, GoogleProvider)
  }
  const signInWithGitHub=()=>{
    GitHubProvider.addScope('user:email');

    return signInWithPopup(auth,GitHubProvider)
  }

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const logOut = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authData = {
    user,
    setUser,
    createUser,
    logOut,
    signIn,
    loading,
    setLoading,
    updateUser,
    signInWithGoogle,
    signInWithGitHub

  };
  return(
   <AuthContext value={authData}>
   {children}
   </AuthContext>
  )
};

export default AuthProvider;
