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
      const db = admin.firestore();

      const data = change.after.data();
      const message = data.messages[data.messages.length - 1];

      // get users ids
      const { uid: senderId } = message;
      const receiverId = data.members.filter((id) => id !== senderId)[0];

      console.log(senderId, "senderId");
      console.log(receiverId, "receiverId");

      // get receiver data
      const receiverSnap = await db.collection("users").doc(receiverId).get();
      const receiver = receiverSnap.data();
      const { pushToken } = receiver;
      console.log("receiver push token", pushToken);

      // get sender data
      const senderSnap = await db.collection("users").doc(senderId).get();
      const sender = senderSnap.data();
      const { firstName } = sender;

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        throw new Error("Not a valid ExpoPushToken");
      }

      const body = `${firstName} sent you a message`;

      // construct message object, must be array
      const msg = [
        {
          to: pushToken,
          sound: "default",
          body,
        },
      ];

      // attempt to send notification
      await expo.sendPushNotificationsAsync(msg);
      console.log("message sent successfully");
    } catch (err) {
      console.log(err);
    }
  });

/**
 * Will send notification to an accountable added to habit
 */
exports.onHabitCreate = functions.firestore
  .document("/habits/{habitId}")
  .onCreate(async (doc) => {
    try {
      // ref database
      const db = admin.firestore();

      // retrieve habit data
      const habitData = doc.data();
      const { uid: creatorId, type } = habitData;

      // make sure the habit has an accountable
      const receiverId = habitData.accountable;

      // if no accountable exists, exit
      if (!receiverId) {
        return;
      }

      // get creator firstName
      const creatorSnap = await db.collection("users").doc(creatorId).get();
      const creator = creatorSnap.data();
      const { firstName: creatorFirstName } = creator;

      // get notification receiver data
      const receiverSnap = await db.collection("users").doc(receiverId).get();
      const receiver = receiverSnap.data();
      const { pushToken } = receiver;

      // Check that all your push tokens appear to be valid Expo push tokens
      if (!Expo.isExpoPushToken(pushToken)) {
        throw new Error("Not a valid ExpoPushToken");
      }

      // construct notifcation
      const body = `${creatorFirstName} added you as an accountability partner! Help them ${type.toLowerCase()} their habit!`;

      // construct message object, must be array
      const msg = [
        {
          to: pushToken,
          sound: "default",
          body,
        },
      ];

      // attempt to send notification
      await expo.sendPushNotificationsAsync(msg);
      console.log("message sent successfully");
    } catch (error) {
      console.log("ERR:", error);
    }
  });

/**
 * This function will reset all of the weekly stats gained over the week
 */
exports.resetHabitCompleted = functions.pubsub
  .schedule("every sunday 00:00") // will need to be "every sunday 00:00"
  .onRun(async (context) => {
    try {
      // ref database
      const db = admin.firestore();
      const batch = db.batch();
      const habitsRef = db.collection("habits");

      // get all habits
      const habits = [];
      const habitsSnap = await habitsRef.get();
      habitsSnap.forEach((habitSnap) => {
        const habitId = habitSnap.id;
        const habit = habitSnap.data();

        // track habitId
        habit.habitId = habitId;
        habits.push(habit);
      });

      console.log("habits", habits);

      // update all completed in reminders to false
      habits.forEach((habit) => {
        // get ids
        const { habitId } = habit;

        // iter through reminders to access completed
        habit.reminders.forEach((reminder) => {
          reminder.completed = false;
        });

        // get habit ref
        const habitRef = habitsRef.doc(habitId);

        // delete habitId off of object
        delete habit.habitId;

        // add to batch
        batch.update(habitRef, habit);
      });

      // write batch
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  });

exports.updateStats = functions.pubsub
  .schedule("every day 00:00") // will need to be "every day 00:00"
  .onRun(async (context) => {
    try {
      // ref
      const db = admin.firestore();
      const batch = db.batch();
      const habitsRef = db.collection("habits");

      const today = new Date();
      let todayInt = today.getDay();
      // todayInt = todayInt === -1 ? 6 : todayInt;

      // get all habits
      const habitsSnap = await habitsRef.get();
      habitsSnap.forEach(async (habitSnap) => {
        const habit = habitSnap.data();

        // add habitId for reference
        habit.habitId = habitSnap.id;

        // check if completed
        if (habit.reminders[todayInt].completed) {
          return null;
        }

        // reset streak
        habit.streak = 0;

        // iterate timesBroken
        habit.stats.timesBroken++;

        // get ref
        const habitRef = habitsRef.doc(habit.habitId);

        // delete habitId
        delete habit.habitId;

        // add to batch
        batch.update(habitRef, habit);
        return true;
      });
      // commit batch
      await batch.commit();
    } catch (error) {
      console.log(error);
    }
  });
