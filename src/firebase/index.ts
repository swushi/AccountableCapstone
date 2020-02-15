import * as firebase from "firebase";
import config from "./config";

const auth = firebase.auth();
const db = firebase.database();

/**
 * Creates and initializes a Firebase instance.
 */
export const init = () => {
  if (!firebase.apps.length) {
    return firebase.initializeApp(config);
  }
  return;
};

/**
 * Creates a new user account associated with the specified email address and password.
 * On successful creation of the user account, this user will also be signed in to your application.
 * User account creation can fail if the account already exists or the password is invalid.
 * Note: The email address acts as a unique identifier for the user and enables an email-based password reset. This function will create a new user account and set the initial user password.
 */
export const signUp = (email: string, password: string) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

/**
 * Asynchronously signs in using an email and password.
 */
export const signIn = (email: string, password: string) => {
  return auth.signInWithEmailAndPassword(email, password);
};
