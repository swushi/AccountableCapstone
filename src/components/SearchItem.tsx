import React, { Component } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { User } from "../types";
import { Layout, Colors } from "../config";

export interface SearchItemProps {
  user: User;
  isFollowing: boolean;
  selecting: boolean;
  onPress: Function;
}

class SearchItem extends Component<SearchItemProps, any> {
  shouldComponentUpdate(prevProps) {
    if (prevProps.user === this.props.user) {
      return false;
    }
    return true;
  }

  render() {
    const { fullName, avatar } = this.props.user;
    const { isFollowing, onPress, selecting } = this.props;
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
        {isFollowing ? (
          <TouchableOpacity
            style={styles.rightSideContainer}
            onPress={() => onPress()}
          >
            <MaterialCommunityIcons
              name={"message"}
              size={18}
              color={Colors.secondary}
            />
            <Text style={styles.addFriendText}>Chat</Text>
          </TouchableOpacity>
        ) : null}
        {selecting ? (
          <TouchableOpacity
            style={styles.rightSideContainer}
            onPress={() => onPress()}
          >
            <Text style={styles.addFriendText}>Select</Text>
          </TouchableOpacity>
        ) : null}
        {!selecting && !isFollowing ? (
          <TouchableOpacity
            style={styles.rightSideContainer}
            onPress={() => onPress()}
          >
            <MaterialCommunityIcons
              name={"plus"}
              size={18}
              color={Colors.secondary}
            />
            <Text style={styles.addFriendText}>Follow</Text>
          </TouchableOpacity>
        ) : null}
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
    borderRadius: Layout.roundness,
    borderBottomWidth: 1,
    borderBottomColor: Colors.offWhite,
  },
  leftSideContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    height: 50,
    width: 50,
    backgroundColor: Colors.secondary,
    overflow: "hidden",
    borderRadius: 100,
    marginRight: Layout.padding,
  },
  name: {
    fontFamily: "Roboto-Regular",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  rightSideContainer: {
    borderRadius: 3,
    borderColor: Colors.secondary,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  addFriendText: {
    fontFamily: "Roboto-Regular",
    color: Colors.secondary,
    paddingLeft: 5,
  },
});

export default SearchItem;
