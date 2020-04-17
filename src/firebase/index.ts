import * as firebase from "firebase";
import "firebase/firestore";
import { FirebaseConfig } from "../config";
import { User, UserID, Habit, Chat, Message, ExpoPushToken } from "../types";

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

export const updatePushToken = (pushToken: ExpoPushToken) =>
  firebase.firestore().collection("users").doc(uid()).update({ pushToken });

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
export const getAllUsers = async () => {
  const users = [];
  const snap = await firebase.firestore().collection("users").get();

  snap.forEach((user) => {
    users.push(user.data());
  });

  return users;
};

/**
 * Should return all data from the database
 */
export const getFollowing = async () => {
  const db = firebase.firestore();
  const usersRef = db.collection("users");
  const followingIds = await db
    .collection("following")
    .doc(uid())
    .collection("user-following")
    .get();

  const users = [];

  followingIds.forEach(async (snap) => {
    const uid = snap.data().uid;
    const user = await usersRef.doc(uid).get();
    users.push(user.data());
  });

  return users;
};

/**
 * Should return all data from the database
 */
export const getFollowers = async () => {
  const db = firebase.firestore();
  const usersRef = db.collection("users");
  const followersIds = await db
    .collection("followers")
    .doc(uid())
    .collection("user-followers")
    .get();

  const users = [];

  followersIds.forEach(async (snap) => {
    const uid = snap.data().uid;
    const user = await usersRef.doc(uid).get();
    users.push(user.data());
  });

  return users;
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
export const follow = (followID: UserID) => {
  firebase
    .firestore()
    .collection("following")
    .doc(uid())
    .collection("user-following")
    .doc(followID)
    .set({ uid: followID });
};

/**
 * Add a follower to a user
 * @param followID
 */
export const addFollower = (followID: UserID) =>
  firebase
    .firestore()
    .collection("followers")
    .doc(followID)
    .collection("user-followers")
    .doc(uid())
    .set({ uid: uid() });

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
export const getHabits = (uid: UserID, callback: Function) =>
  firebase
    .firestore()
    .collection("habits")
    .where("uid", "==", uid)
    .onSnapshot((snapshot) => {
      let habits = [];
      snapshot.forEach((doc) => {
        habits.push({ ...doc.data(), habitId: doc.id });
      });
      callback(habits);
    });

export const getAvatarURL = () =>
  firebase.storage().ref().child(`profilePictures/${uid()}`).getDownloadURL();

export const storeUserAvatarInStorage = (blob: Blob) =>
  firebase.storage().ref().child(`profilePictures/${uid()}`).put(blob);

export const storeUserAvatarInDB = (url: string) =>
  firebase.firestore().collection("users").doc(uid()).update({ avatar: url });

/**
 * Will get the chat between the two users
 * @param user current user obj
 * @param friend other user obj
 */
export const getChat = async (
  userId: UserID,
  friendId: UserID,
  callback: Function
) => {
  let chatId;
  if (userId < friendId) {
    chatId = userId + friendId;
  } else {
    chatId = friendId + userId;
  }

  const chatRef = await firebase.firestore().collection("chats").doc(chatId);

  const listener = chatRef.onSnapshot(async (doc) => {
    // @ts-ignore
    const chat: Chat = doc.data();
    if (!chat) {
      await initChat(userId, friendId);
    } else {
      callback(chat);
    }
  });

  return listener;
};

export const initChat = async (userId: UserID, friendId: UserID) => {
  let chatId;
  if (userId < friendId) {
    chatId = userId + friendId;
  } else {
    chatId = friendId + userId;
  }

  const chatRef = firebase.firestore().collection("chats").doc(chatId);

  const chat: Chat = {
    createdAt: Date.now(),
    chatId,
    members: [userId, friendId],
  };

  await chatRef.set(chat);
};

export const sendMessage = async (
  message: Message,
  userId: UserID,
  friendId: UserID
) => {
  let chatId;
  if (userId < friendId) {
    chatId = userId + friendId;
  } else {
    chatId = friendId + userId;
  }

  const chatRef = firebase.firestore().collection("chats").doc(chatId);
  const snap = await chatRef.get();
  // @ts-ignore
  const chat: Chat = snap.data();

  if (chat.messages) {
    chat.messages = [...chat.messages, message];
  } else {
    chat.messages = [message];
  }

  await chatRef.update(chat);
};
