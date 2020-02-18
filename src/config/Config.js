import { Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

const colors = {
  primary: "#8b67f0",
  background: "#f1f1f1",
  textPrimary: "#424242"
};

export default config = {
  padding: 12,
  height,
  width,
  roundness: 12,
  colors
};
