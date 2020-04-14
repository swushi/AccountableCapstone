import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { Colors, Layout } from "../config";
import { Message } from "../types";

interface Props {
  sender: Boolean;
  message: Message;
  image?: string;
}

const IMAGE_HEIGHT = Layout.height * 0.035;

class ChatMessage extends Component<Props, any> {
  render() {
    const { sender, message, image } = this.props;
    return (
      <View
        style={{
          backgroundColor: sender ? Colors.primary : Colors.offWhite,
          paddingHorizontal: Layout.padding,
          paddingVertical: Layout.padding / 2,
          marginBottom: Layout.padding,
          marginRight: sender ? IMAGE_HEIGHT + 5 : 0,
          marginLeft: !sender ? IMAGE_HEIGHT + 5 : 0,
          maxWidth: Layout.width * 0.6,
          borderRadius: Layout.roundness,
          alignSelf: sender ? "flex-end" : "flex-start",
          borderBottomStartRadius: !sender ? 0 : Layout.roundness,
          borderBottomEndRadius: sender ? 0 : Layout.roundness,
        }}
      >
        <Text
          style={{
            color: sender ? "#fff" : Colors.textPrimary,
          }}
        >
          {message.content}
        </Text>
        <View
          style={{
            height: IMAGE_HEIGHT,
            width: IMAGE_HEIGHT,
            position: "absolute",
            bottom: 0,
            right: sender ? -(IMAGE_HEIGHT + 5) : null,
            left: !sender ? -(IMAGE_HEIGHT + 5) : null,
          }}
        >
          <Image
            style={{
              flex: 1,
              height: null,
              width: null,
              borderRadius: 100,
              overflow: "hidden",
            }}
            source={{ uri: image }}
          />
        </View>
      </View>
    );
  }
}

export default ChatMessage;
