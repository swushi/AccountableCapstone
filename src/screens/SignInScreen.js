import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handlePress() {
    this.props.navigation.navigate("SignUp");
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.handlePress()}>
          <Text>Go to signup</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 8
  }
});

export default SignInScreen;
