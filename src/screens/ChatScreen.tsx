import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { connect } from "react-redux";
import { Header } from "../components";
import { Layout, Colors } from "../config";
import * as firebase from "../firebase";
import { User, Chat } from "../types";

interface Props {
  navigation: any;
  route: any;
  user: User;
}
interface State {
  input: string;
  messages: Chat[];
}

class ChatScreen extends Component<Props, State> {
  state = {
    messages: [],
    input: "",
  };

  async componentDidMount() {
    // destructure
    const { route, user } = this.props;
    const friend: User = route.params.user;

    // get chat from db
    let chatRef = firebase.getChat(user.uid, friend.uid);

    // store chats in state
    // let messages = [];
    // chat.forEach((message) => {
    //   messages.push(message.data());
    // });
    // this.setState({ messages });
  }

  render() {
    const friend: User = this.props.route.params.user;
    const { messages, input } = this.state;
    return (
      <View style={styles.container}>
        <Header chatHeader={friend.fullName} />
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior="padding"
        >
          <FlatList
            style={{ flex: 1 }}
            data={messages}
            renderItem={({ item }) => <Text>{item.body}</Text>}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Send a message"
              value={input}
              onChangeText={(text) => this.setState({ input: text })}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: Layout.padding,
    backgroundColor: Colors.background,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ChatScreen);
