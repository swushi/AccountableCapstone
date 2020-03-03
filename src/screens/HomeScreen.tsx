import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

export interface HomeScreenProps {}

export interface HomeScreenState {}

class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> {
  constructor(props: HomeScreenProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>HomeScreen Component</Text>
      </View>
    );
  }
}

export default HomeScreen;
