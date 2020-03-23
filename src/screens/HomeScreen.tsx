import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Header } from "../components";

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
        <Header />
        <Text>HomeScreen Component</Text>
      </View>
    );
  }
}

export default HomeScreen;
