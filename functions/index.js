const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Expo } = require("expo-server-sdk");

// init app
admin.initializeApp();
const expo = new Expo();

exports.onMessageSend = functions.firestore
  .document("/chats/{chatId}")
  .onUpdate(async (change) => {
    try {
      const data = change.after.data();
      const message = data.messages[data.messages.length - 1];
      const { uid } = message;

      const db = admin.firestore();
      const snap = await admin.firestore().collection("users").doc(uid).get();
      const user = snap.data();
      const { firstName, pushToken } = user;

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        // reject(Error("Not a valid ExpoPushToken"));
        console.log("not a valie expopushtoken");
      }

      const body = `${firstName} sent you a message`;

      // construct message object, must be array
      const msg = [
        {
          to: pushToken,
          sound: "default",
          body,
          data: { uid },
        },
      ];

      // attempt to send notification
      await expo.sendPushNotificationsAsync(msg);

      // resolve("Success");
    } catch (err) {
      console.log("Send notification err", err);
      // reject(err);
    }
  });
