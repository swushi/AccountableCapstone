import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors, Layout } from "../config";
import { Message } from "../types";

interface Props {
  sender: Boolean;
  message: Message;
  image?: string;
  style?: ViewStyle;
}

const IMAGE_HEIGHT = Layout.height * 0.035;

class ChatMessage extends Component<Props, any> {
  render() {
    const { sender, message, image, style } = this.props;
    return (
      <View
        style={{
          backgroundColor: sender ? Colors.primary : Colors.offWhite,
          paddingHorizontal: Layout.padding,
          paddingVertical: Layout.padding / 2,
          marginTop: Layout.padding,
          maxWidth: Layout.width * 0.6,
          borderRadius: Layout.roundness,
          alignSelf: sender ? "flex-end" : "flex-start",
          borderBottomStartRadius: !sender ? 0 : Layout.roundness,
          borderBottomEndRadius: sender ? 0 : Layout.roundness,
          ...style,
        }}
      >
        <Text
          style={{
            color: sender ? "#fff" : Colors.textPrimary,
          }}
        >
          {message.content}
        </Text>
      </View>
    );
  }
}

export default ChatMessage;
