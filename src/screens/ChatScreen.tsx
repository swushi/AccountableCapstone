import React, { Component } from "react";
import {
  Image,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header, ChatMessage } from "../components";
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
  chat: Chat | Object;
  sending: Boolean;
}

class ChatScreen extends Component<Props, State> {
  state = {
    chat: { messages: [] },
    input: "",
    sending: false,
  };
  inputRef = null;
  chatRef = null;
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
        (chat: Chat) => {
          this.setState({ chat });
          setTimeout(() => this.chatRef.scrollToEnd(), 200);
        }
      );
    } catch (err) {
      console.log("chat fetch err", err);
    }
  }

  componentWillUnmount() {
    // detach database listener
    this.listener();
  }

  async sendMessageAsync() {
    // destructure
    const { input } = this.state;
    const { route, user } = this.props;
    const friend: User = route.params.user;

    // if message is empty, abort
    if (input.length === 0) return;

    // clear input
    this.inputRef.clear();

    // set loading state
    this.setState({ sending: true });

    // create chat obj
    const message: Message = {
      content: input,
      createdAt: Date.now(),
      uid: firebase.uid(),
    };

    // send message
    try {
      await firebase.sendMessage(message, user.uid, friend.uid);
      this.setState({ sending: false });
    } catch (err) {
      this.setState({ sending: false });
      console.log("send message err", err);
    }
  }

  render() {
    const friend: User = this.props.route.params.user;
    const { user } = this.props;
    const { chat, input, sending } = this.state;
    return (
      <View style={styles.container}>
        <Header chatHeader={friend.fullName} />
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior="padding"
        >
          <FlatList
            ref={(ref) => (this.chatRef = ref)}
            style={{ flex: 1 }}
            data={chat.messages}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <ChatMessage
                sender={item.uid === user.uid}
                message={item}
                style={{
                  marginBottom:
                    index === chat.messages.length - 1 ? Layout.padding : 0,
                }}
              />
            )}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={{ flex: 1 }}
              ref={(ref) => (this.inputRef = ref)}
              placeholder="Send a message"
              value={input}
              onChangeText={(text) => this.setState({ input: text })}
              onFocus={() => setTimeout(() => this.chatRef.scrollToEnd(), 100)}
            />
            {!sending ? (
              <TouchableOpacity onPress={() => this.sendMessageAsync()}>
                <MaterialCommunityIcons
                  name="send"
                  size={20}
                  color={Colors.primary}
                />
              </TouchableOpacity>
            ) : (
              <ActivityIndicator />
            )}
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
    paddingHorizontal: Layout.padding,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: Layout.padding / 2,
    paddingHorizontal: Layout.padding,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: Layout.roundness,
    marginBottom: Layout.padding,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(ChatScreen);
