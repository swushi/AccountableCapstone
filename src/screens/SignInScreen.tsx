import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as firebase from "../firebase";
import { User } from "../types";

type SignInScreenProps = {
  navigation: any;
};

type SignInScreenState = {
  email: string;
  password: string;
  err: any;
};

class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  constructor(props: SignInScreenProps) {
    super(props);
    this.state = { email: "", password: "", err: null };
  }

  navToSignUp = () => {
    this.props.navigation.navigate("Signup");
  };

  handlePress = async () => {
    try {
      // handle sign up
      await this.signInAsync();

      // navigate if okay
      this.props.navigation.navigate("Main");
    } catch (err) {}
  };

  signInAsync = async () => {
    // deref
    const { navigate } = this.props.navigation;
    const { email, password, err } = this.state;

    try {
      // Sign up user
      const { user } = await firebase.signUp(email, password);
      const { uid } = user;

      // Sign in user
      const signIn = firebase.signIn(email, password);

      // create user obj
      const User: User = {
        uid,
        email,
        firstName: "John",
        lastName: "Doe"
      };

      // Initialize user in database
      const createUser = firebase.createUser(User);

      // Store user globally in Redux
      // storeUser(User);

      // wait for async signIn and createUser to finish
      await Promise.all([signIn, createUser]);
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
        <TouchableOpacity onPress={() => this.navToSignUp()}>
          <Text>Go to Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SignInScreen;
