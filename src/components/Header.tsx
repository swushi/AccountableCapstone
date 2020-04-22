import React, { useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Layout, Colors } from "../config";
import * as firebase from "../firebase";

export interface HeaderProps {
  hideBack?: Boolean;
  chatHeader?: String;
  rightIcon?: String;
  rightOnPress?: Function;
}

function Header(props: HeaderProps) {
  const navigation = useNavigation();
  const { hideBack, chatHeader, rightIcon, rightOnPress } = props;
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        {chatHeader ? chatHeader : "Accountable"}
      </Text>
      {!hideBack && (
        <View style={styles.backButton}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={35}
              color={Colors.headerText}
            />
          </TouchableOpacity>
        </View>
      )}
      {rightIcon && (
        <View style={styles.rightButton}>
          <TouchableOpacity onPress={() => rightOnPress()}>
            <MaterialCommunityIcons
              name={rightIcon}
              size={20}
              color={Colors.headerText}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: Layout.headerHeight,
    backgroundColor: Colors.primary,
    paddingTop: Layout.statusBarHeight,
    paddingBottom: 5,
    justifyContent: "flex-end",
  },
  headerText: {
    fontFamily: "Roboto-Bold",
    color: Colors.headerText,
    fontSize: 30,
    alignSelf: "center",
  },
  backButton: {
    position: "absolute",
    top: Layout.statusBarHeight + 10,
    left: 10,
  },
  rightButton: {
    position: "absolute",
    top: Layout.statusBarHeight + 18,
    right: 10,
  },
});

export default Header;
