import { Dimensions } from "react-native";
import Constants from "expo-constants";
const { height, width } = Dimensions.get("window");
import { Day } from "../types";

export const Colors = {
  primary: "#45A29E",
  secondary: "#084C61",
  background: "#fff",
  offWhite: "#eeeeee",
  textPrimary: "#0B0C10",
  headerText: "#fff",
  inactive: "#424242",
  good: "green",
  bad: "red",
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
};

export const Layout = {
  padding: 12,
  height,
  width,
  roundness: 3,
  headerHeight: height * 0.1,
  statusBarHeight: Constants.statusBarHeight,
};

export const FirebaseConfig = {
  apiKey: "AIzaSyBk1lFHbxoNqWAqwexSHne_fPNz7qCsiKQ",
  authDomain: "accountable-ba5c6.firebaseapp.com",
  databaseURL: "https://accountable-ba5c6.firebaseio.com",
  projectId: "accountable-ba5c6",
  storageBucket: "accountable-ba5c6.appspot.com",
  messagingSenderId: "806395418095",
  appId: "1:806395418095:web:6124cb947e2df6b779121a",
  measurementId: "G-33XWPTKTK5",
};

export const validateEmail = (email) => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const getTimeString = (time: Date) => {
  let hours = time.getHours() % 12;
  let minutes = time.getMinutes();
  // @ts-ignore
  if (minutes < 10) minutes = "0" + minutes;
  if (hours === 0) hours = 12;
  const pm = time.getHours() >= 12;

  return `${hours}:${minutes} ${pm ? "PM" : "AM"}`;
};

export const getRemindTime = (time: Date, day: Day) => {
  const timeNum = time.getTime();
  let dayNum;

  switch (day) {
    case "Sun":
      dayNum = 0;
      break;
    case "Mon":
      dayNum = 1;
      break;
    case "Tue":
      dayNum = 2;
      break;
    case "Wed":
      dayNum = 3;
      break;
    case "Thu":
      dayNum = 4;
      break;
    case "Fri":
      dayNum = 5;
      break;
    case "Sat":
      dayNum = 6;
      break;
    default:
      break;
  }

  let resultDate = new Date(timeNum);

  resultDate.setDate(time.getDate() + ((7 + dayNum - time.getDay()) % 7));
  if (resultDate.getTime() < new Date().getTime()) {
    resultDate.setDate(resultDate.getDate() + 7);
  }

  return resultDate;
};
