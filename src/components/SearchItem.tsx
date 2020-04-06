import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "../types";
import { Layout, Colors } from "../config";

export interface SearchItemProps {
  user: User;
  isFriend: boolean;
  onPress: Function;
}

class SearchItem extends Component<SearchItemProps, any> {
  render() {
    const { fullName, avatar } = this.props.user;
    const { isFriend, onPress } = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.leftSideContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                avatar
                  ? { uri: avatar }
                  : require("../../assets/tempAvatar.png")
              }
              style={{ flex: 1, height: null, width: null }}
            />
          </View>
          <Text style={styles.name}>{fullName}</Text>
        </View>
        {isFriend ? (
          <Text>friends</Text>
        ) : (
          <TouchableOpacity
            style={styles.rightSideContainer}
            onPress={() => onPress()}
          >
            <MaterialCommunityIcons
              name={"plus"}
              size={30}
              color={Colors.primary}
            />
            <Text style={styles.addFriendText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: Layout.padding,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    marginTop: Layout.padding,
    borderRadius: Layout.roundness,
    ...Colors.shadow,
  },
  leftSideContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    height: 50,
    width: 50,
    backgroundColor: Colors.primary,
    overflow: "hidden",
    borderRadius: 100,
    marginRight: Layout.padding,
  },
  name: {
    fontFamily: "Roboto-Regular",
    fontSize: 20,
    color: Colors.secondary,
  },
  rightSideContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  addFriendText: {
    fontFamily: "Roboto-Regular",
    color: Colors.secondary,
  },
});

export default SearchItem;
