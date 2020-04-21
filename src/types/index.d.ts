export type UserID = string;
export type ChatID = string; // userid < friendId
export type ReminderID = string;
export type HabitID = string;
export type ExpoPushToken = string;

export type User = {
  uid?: UserID;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string;
  email: string;
  pushToken?: ExpoPushToken;
  notify?: boolean;
  accountables?: Array<User>;
};

export type ExpoLocalNotificationOptions = {
  title: string;
  body: string;
  data?: Object;
  categoryId?: string;
};

export type ExpoRepeatOptions = {
  time: Date;
  repeat?: "minute" | "hour" | "day" | "week" | "month" | "year";
};

export type ExpoLocalNotification = {
  notification: ExpoLocalNotificationOptions;
  repeat?: ExpoRepeatOptions;
};

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type Reminder = {
  day: Day;
  active: Boolean;
  completed: Boolean;
  time?: String; // 00:30 or 15:50
  localId?: String; // local notification id used for cancelling notification
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
  type: "Create" | "Break";
  title: string;
  active: Boolean; // if the habit is currently on-going
  dateStart: Date;
  reminders: Array<Reminder>;
  notes: Array<string>;
  streak?: number;
  desc?: string;
  stats: Stats;
  habitId?: HabitID; // optional because when created on client, will not have id yet
  accountable?: UserID;
};

/**
 * Stats for a single habit.
 */
export type Stats = {
  timesHit: number;
  timesBroken: number;
};

export type Message = {
  content: string;
  uid: UserID;
  createdAt: Number;
};

export type Chat = {
  createdAt: Number;
  chatId: ChatID;
  members: UserID[];
  messages?: Message[];
};
