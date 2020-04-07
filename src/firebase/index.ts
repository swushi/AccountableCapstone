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
 * Init following for user so values can be
 */
export const createUserFollowing = () =>
  firebase.firestore().collection("following").doc(uid()).set({});

export const createUserFollowers = () =>
  firebase.firestore().collection("followers").doc(uid()).set({});

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
 * Should return all data from the database
 */
export const getFollowing = () =>
  firebase
    .firestore()
    .collection("following")
    .doc(uid())
    .collection("user-following")
    .get();

/**
 * Should return all data from the database
 */
export const getFollowers = () =>
  firebase
    .firestore()
    .collection("followers")
    .doc(uid())
    .collection("user-followers")
    .get();

/**
 * Search all users in database, optional 3rd argument that allows you to
 * search followers or following
 * @param input
 * @param index
 * @param type
 */
export const searchUsers = (
  input: string,
  index: string,
  type: "following" | "followers" | "discover" = "discover"
) => {
  if (type === "following") {
    return firebase
      .firestore()
      .collection("following")
      .doc(uid())
      .collection("user-following")
      .where(index, ">=", input)
      .where(index, "<=", input + "\uf8ff") // string that starts with sequence
      .get();
  } else if (type === "followers") {
    return firebase
      .firestore()
      .collection("followers")
      .doc(uid())
      .collection("user-followers")
      .where(index, ">=", input)
      .where(index, "<=", input + "\uf8ff") // string that starts with sequence
      .get();
  }

  return firebase
    .firestore()
    .collection("users")
    .where(index, ">=", input)
    .where(index, "<=", input + "\uf8ff") // string that starts with sequence
    .get();
};

/**
 * Sends users a email to rest password
 */
export const passwordReset = (email: string) =>
  firebase.auth().sendPasswordResetEmail(email);

/**
 * Adds a user to the current users following
 * @param followID
 */
export const follow = async (followID: UserID) => {
  const user = await getUser(followID);
  firebase
    .firestore()
    .collection("following")
    .doc(uid())
    .collection("user-following")
    .doc(followID)
    .set(user.data());
};

/**
 * Add a follower to a user
 * @param followID
 */
export const addFollower = async (followID: UserID) => {
  const user = await getUser(uid());
  firebase
    .firestore()
    .collection("followers")
    .doc(followID)
    .collection("user-followers")
    .doc(uid())
    .set(user.data());
};

/**
 *  Pushes a Created Habit to database at ref(`/users/${user.uid}/`)
 * @param user
 * @param habit
 */
export const createHabit = (habit: Habit) =>
  firebase.firestore().collection("habits").add(habit);

/**
 * Get users habits
 * @param uid
 */
export const getHabits = (uid: UserID) =>
  firebase.firestore().collection("habits").where("test", "==", uid).get();

export const getAvatarURL = () =>
  firebase.storage().ref().child(`profilePictures/${uid()}`).getDownloadURL();

export const storeUserAvatarInStorage = (blob: Blob) =>
  firebase.storage().ref().child(`profilePictures/${uid()}`).put(blob);

export const storeUserAvatarInDB = (url: string) =>
  firebase.firestore().collection("users").doc(uid()).update({ avatar: url });
