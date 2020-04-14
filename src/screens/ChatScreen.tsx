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
import { User, Chat, Message } from "../types";

interface Props {
  navigation: any;
  route: any;
  user: User;
}
interface State {
  input: string;
  messages: Message[];
}

class ChatScreen extends Component<Props, State> {
  state = {
    messages: [],
    input: "",
  };
  listener: () => void;

  async componentDidMount() {
    // destructure
    const { route, user } = this.props;
    const friend: User = route.params.user;

    try {
      // get chat from db
      this.listener = await firebase.getChat(
        user.uid,
        friend.uid,
        (messages: Message[]) => this.setState({ messages })
      );
    } catch (err) {
      console.log("chat fetch err", err);
    }
  }

  componentWillUnmount() {
    this.listener();
  }

  async sendMessageAsync() {
    // destructure
    const { messages, input } = this.state;
    const { route, user } = this.props;
    const friend: User = route.params.user;

    // create chat obj
    const message: Message = {
      content: input,
      createdAt: Date.now(),
      uid: firebase.uid(),
    };

    // send message
    try {
      await firebase.sendMessage(message, user.uid, friend.uid);
    } catch (err) {
      console.log("send message err", err);
    }
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
          <Text>where they at</Text>
          <FlatList
            style={{ flex: 1 }}
            data={messages}
            renderItem={({ item }) => <Text>{item.content}</Text>}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Send a message"
              value={input}
              onChangeText={(text) => this.setState({ input: text })}
              onSubmitEditing={() => this.sendMessageAsync()}
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
