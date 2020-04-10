import React, { Component } from "react";
import { Text, View } from "react-native";
import { User } from "../types";
import * as firebase from "../firebase";

interface Props {}

interface State {
  value: string;
  following: User[];
  loading: Boolean;
}

class SelectAccountableScreen extends Component<Props, State> {
  state = {
    value: "",
    following: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchFollowing();
  }

  async fetchFollowing() {
    this.setState({ loading: true });
    const followingArray = [];
    try {
      const following = await firebase.getFollowing();
      following.forEach((user) => {
        followingArray.push(user.data());
      });

      this.setState({
        following: followingArray,
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

export default SelectAccountableScreen;
