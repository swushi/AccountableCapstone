import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as firebase from "../firebase";
import "firebase/firestore";

type SignUpState = {
  err: boolean;
  email: string;
  password: string;
};

type SignUpProps = {
  navigation: any;
};

class SignUpScreen extends Component<{}, SignUpState> {
  state: SignUpState;
  props: SignUpProps;
  constructor(props) {
    super(props);
    this.state = { err: null, email: "test@gmail.com", password: "password" };
  }

  signUpAsync = async () => {
    const timeStart = new Date();
    console.log("in func");

    // deref
    const { navigate } = this.props.navigation;
    const { email, password, err } = this.state;

    try {
      // Sign up user
      const { user } = await firebase.signUp(email, password);
      const { uid } = user;

      // Sign in user
      const signIn = firebase.signIn(email, password);

      // Initialize user in database
      const createUser = firebase.createUser({
        uid,
        email,
        firstName: "John",
        lastName: "Doe"
      });

      // wait for async signIn and createUser to finish
      await Promise.all([signIn, createUser]);
      const timeTook = new Date().getTime() - timeStart.getTime();
      console.log("Time took:", timeTook);

      // navigate to MainStack upon success
      navigate("Main");
    } catch (err) {
      // log error
      alert(err);

      // set error in state
      this.setState({ err });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.signUpAsync()}>
          <Text>Sign up user</Text>
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

export default SignUpScreen;
