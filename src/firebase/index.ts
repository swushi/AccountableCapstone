import * as firebase from "firebase";
import "firebase/firestore";
import { FirebaseConfig } from "../config";
import { User } from "../types";

/**
 * Creates and initializes a Firebase instance.
 */
export const init = () => {
  if (!firebase.apps.length) {
    return firebase.initializeApp(FirebaseConfig);
  }
  return;
};

/**
 * Creates a new user account associated with the specified email address and password.
 * On successful creation of the user account, this user will also be signed in to your application.
 * User account creation can fail if the account already exists or the password is invalid.
 * Note: The email address acts as a unique identifier for the user and enables an email-based password reset. This function will create a new user account and set the initial user password.
 */
export const signUp = (email: string, password: string) =>
  firebase.auth().createUserWithEmailAndPassword(email, password);

/**
 * Asynchronously signs in using an email and password.
 */
export const signIn = (email: string, password: string) =>
  firebase.auth().signInWithEmailAndPassword(email, password);

/** Signs user out of the application */
export const signOut = () =>
  firebase.auth().signOut().then(function() {
    //console.log('Signed Out');
  }, function(error) {
    //console.error('Sign Out Error', error);
  });

/**
 * Creates a new user in the database at location ref(`/users/${user.uid}`).
 * Returns a promise with snapshot if successful
 * @param user
 */
export const createUser = (user: User) =>
  firebase
    .firestore()
    .collection("users")
    .doc(user.uid)
    .set(user);
/**
 * Sends users a email to rest password 
 */
export const passwordReset= (email:string) =>
  firebase.auth().sendPasswordResetEmail(email);