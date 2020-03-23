import { Dimensions } from "react-native";
const { height, width } = Dimensions.get("window");

export const Colors = {
  primary: "#8b67f0",
  background: "#f1f1f1",
  textPrimary: "#424242",
  inactive: "#424242"
};

export const Design = {
  padding: 12,
  height,
  width,
  roundness: 12
};

export const FirebaseConfig = {
  apiKey: "AIzaSyBk1lFHbxoNqWAqwexSHne_fPNz7qCsiKQ",
  authDomain: "accountable-ba5c6.firebaseapp.com",
  databaseURL: "https://accountable-ba5c6.firebaseio.com",
  projectId: "accountable-ba5c6",
  storageBucket: "accountable-ba5c6.appspot.com",
  messagingSenderId: "806395418095",
  appId: "1:806395418095:web:6124cb947e2df6b779121a",
  measurementId: "G-33XWPTKTK5"
};

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};
