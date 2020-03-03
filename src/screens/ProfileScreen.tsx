import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

export interface ProfileScreenProps {}

export interface ProfileScreenState {}

class ProfileScreen extends React.Component<
  ProfileScreenProps,
  ProfileScreenState
> {
  constructor(props: ProfileScreenProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>ProfileScreen Component</Text>
      </View>
    );
  }
}

export default ProfileScreen;
