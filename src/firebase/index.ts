import * as firebase from "firebase";
import "firebase/firestore";
import { FirebaseConfig } from "../config";
import { User, UserID, Habit } from "../types";

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
export const signOut = () => firebase.auth().signOut();

/**
 * Get users id
 */
export const uid = () => firebase.auth().currentUser.uid;

/**
 * Creates a new user in the database at location ref(`/users/${user.uid}`).
 * Returns a promise with snapshot if successful
 * @param user
 */
export const createUser = (user: User) =>
  firebase.firestore().collection("users").doc(user.uid).set(user);

/**
 * Returns the user from the database
 * @param uid
 */
export const getUser = (uid: UserID) =>
  firebase.firestore().collection("users").doc(uid).get();

/**
 * Should return all data from the database
 */
export const getAllUsers = () => firebase.firestore().collection("users").get();

/**
 * Triggered when text is entered in messages search bar
 * @param input
 */
export const searchUsers = (input: string) =>
  firebase
    .firestore()
    .collection("users")
    .where("fullName", ">=", input)
    .where("fullName", "<=", input + "\uf8ff") // string that starts with sequence
    .get();

/**
 * Sends users a email to rest password
 */
export const passwordReset = (email: string) =>
  firebase.auth().sendPasswordResetEmail(email);

/**
 *  Pushes a Created Habit to database at ref(`/users/${user.uid}/`)
 * @param user
 * @param habit
 */
export const createHabit = (habit: Habit) =>
  firebase.firestore().collection("habits").add(habit);

export const getHabits = (uid: UserID) =>
  firebase.firestore().collection("habits").where("test", "==", uid).get();

export const getAvatarURL = () => 
  firebase.storage().ref().child(`profilePictures/${uid()}`).getDownloadURL()

export const storeUserAvatarInStorage = (blob: Blob) => 
  firebase.storage().ref().child(`profilePictures/${uid()}`).put(blob);

export const storeUserAvatarInDB = (url: string) =>
  firebase.firestore().collection("users").doc(uid()).update({ avatar: url });
