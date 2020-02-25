import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as firebase from "../firebase";
import { TextField } from "react-native-material-textfield";
import { User } from "../types";

type SignInScreenProps = {
  navigation: any;
};

type SignInScreenState = {
  email: string;
  password: string;
  errorMessage: any;
};

class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  constructor(props: SignInScreenProps) {
    super(props);
    this.state = { 
      email: "", 
      password: "", 
      errorMessage: null 
    };
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
    const { email, password, errorMessage } = this.state;

    try {
      // Sign in user
      const signIn =  await firebase.signIn(email, password);

      // wait for async signIn and createUser to finish
      await Promise.all([signIn]);
      this.props.navigation.navigate("Main");
    } catch (err) {
      alert(err);

      // set error in state
      this.setState({ errorMessage: err });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TextField label="email" onChangeText={ (text: string) => this.setState({email: text})}/>
        <TextField error={this.state.errorMessage} label="password" onChangeText={ (text: string) => this.setState({password: text})} />
        <TouchableOpacity onPress={() => this.signInAsync()}>
          <Text>Sign In</Text>
        </TouchableOpacity> 
        <TouchableOpacity onPress={() => this.navToSignUp()}>
          <Text>Create an account</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  input: {

  }
});

export default SignInScreen;
