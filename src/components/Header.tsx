import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Layout, Colors } from "../config";

export interface HeaderProps {}

class Header extends React.Component<HeaderProps, any> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Accountable</Text>
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => null}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={35}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: Layout.headerHeight,
    backgroundColor: Colors.primary,
    paddingTop: Layout.statusBarHeight,
    paddingBottom: 5,
    justifyContent: "flex-end"
  },
  headerText: {
    fontFamily: "Roboto-Bold",
    color: "#fff",
    fontSize: 30,
    alignSelf: "center"
  },
  backButton: {
    position: "absolute",
    top: Layout.statusBarHeight,
    left: 5
  }
});

export default Header;
