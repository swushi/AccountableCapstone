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

export type Reminder = {
  name: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
  active: Boolean;
  time?: String; // 00:30 or 15:50
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
  uid: UserID;
  type: "create" | "break";
  title: string;
  active: Boolean; // if the habit is currently on-going
  dateStart: Date;
  reminders: Array<Reminder>;
  desc?: string;
  stats?: Stats;
  id?: HabitID; // optional because when created on client, will not have id yet
  accountable?: User;
};

/**
 * Stats for a single habit.
 */
export type Stats = {
  streak: number;
  timesBroken: number;
};
