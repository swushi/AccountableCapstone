import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

export interface MessagesScreenProps {}

export interface MessagesScreenState {}

class MessagesScreen extends React.Component<
  MessagesScreenProps,
  MessagesScreenState
> {
  constructor(props: MessagesScreenProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Text>MessagesScreen Component</Text>
      </View>
    );
  }
}

export default MessagesScreen;
