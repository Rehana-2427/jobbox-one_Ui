import { FacebookAuthProvider, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import React from 'react';
import SocialButtons from './SocialButtons'; // Adjust the path if necessary
import app from './firebase'; // Adjust the path for your Firebase configuration

const SignInPage = () => {
  const auth = getAuth(app); // Get the auth instance

  const googleHandler = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in with Google: ", user);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const facebookHandler = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in with Facebook: ", user);
    } catch (error) {
      console.error("Error signing in with Facebook: ", error);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <SocialButtons
        googleHandler={googleHandler}
        facebookHandler={facebookHandler}
        routeUrl="/signup" // Adjust the signup route as necessary
        isLogin={true} // or false based on the context
      />
    </div>
  );
};

export default SignInPage;
