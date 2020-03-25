export type UserID = string;
export type ReminderID = string;
export type HabitID = string;
export type ExpoPushToken = string;
export type ExpoNotification = Object;

export type User = {
  uid?: UserID;
  firstName: string;
  lastName: string;
  email: string;
  pushToken?: ExpoPushToken;
  accountables?: Array<User>;
};

/**
 * Lifecylce of habits:
 * 1. User generates habit(without HabitID)
 * 2. Push to database and receive HabitID
 * 3. Pull from database to use during lifespan
 * 4a. Set habit to inactive when dateEnd is reached
 * 4b. User deletes habit.
 */

// TODO: Make it reflect actual habit needs
export type Habit = {
  id?: HabitID; // optional because when created on client, will not have id yet
  type: "create" | "break";
  title: string;
  desc: string;
  active: Boolean; // if the habit is currently on-going
  dateStart: string;
  dateEnd: string;
  stats: Stats;
  reminders: Array<ReminderID>;
  accountable: User;
};

/**
 * Going to store individual reminders for a user. These will go in their own document in
 * firebase, and on each day, Firebase Functions will go through and send notifictations
 * based on what Reminders show up for that day.
 */
export type Reminder = {
  rid: ReminderID;
  uid: UserID;
  day: string;
  time: string;
  pushToken: ExpoPushToken;
  notification: ExpoNotification;
};

/**
 * Stats for a single habit.
 */
export type Stats = {
  streak: number;
  timesBroken: number;
};
