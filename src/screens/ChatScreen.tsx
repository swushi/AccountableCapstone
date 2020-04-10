import React, { Component } from "react";
import { Text, View } from "react-native";

interface Props {
  navigation: any;
  route: any;
}
interface State {
  message: string;
}

class ChatScreen extends Component<Props, State> {
  componentDidMount() {
    // figure out what chat it is
    const { route } = this.props;
    const { params } = route;
  }
  render() {
    return (
      <View>
        <Text> textInComponent </Text>
      </View>
    );
  }
}

export default ChatScreen;
