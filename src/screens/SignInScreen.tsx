import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import * as firebase from "../firebase";
import { TextField } from "react-native-material-textfield";
import { Design, Colors, validateEmail } from "../config";
import * as Animatable from "react-native-animatable";
import { User } from "../types";

type SignInScreenProps = {
  navigation: any;
};

type SignInScreenState = {
  email: string;
  password: string;
  error: boolean;
  emailError: any;
  passwordError: any;
};

class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  containerRef: any;
  constructor(props: SignInScreenProps) {
    super(props);
    this.state = { 
      email: "", 
      password: "", 
      error: null,
      emailError: null,
      passwordError: null,
    };
    this.signInAsync = this.signInAsync.bind(this);
    this.containerRef = null;
  }

  handleOnFocus = () => {
    this.slide("up");
    this.setState({
      emailError: null,
      passwordError: null
    });
  };
  handleOnBlur = () => {

    this.slide("down");

  };
  slide = (direction: "up" | "down") => {
    const slideAmount = Design.height * 0.3;
    const translation = direction === "up" ? -1 * slideAmount : 0;
    this.containerRef.transitionTo({
      transform: [{ translateY: translation }]
    });
  };


  navToSignUp = () => {
    this.props.navigation.navigate("SignUp");
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
    const { email, password, error } = this.state;
    
    if(!this.validateInput()) {
      return;
    }

    try {
      // Sign in user
      const signIn =  await firebase.signIn(email, password);

      // wait for async signIn and createUser to finish
      await Promise.all([signIn]);
      this.props.navigation.navigate("Main");
    } catch (err) {
      alert(err);

      // set error in state
      //this.setState({ emailError: error });
    }
  };

  validateInput = () => {
      const { email, password } = this.state;
      let inputisValid = false;

      if(!validateEmail(email)) {
        inputisValid = true;
        this.setState({
          emailError: "Please enter a valid email."
        });
      }
      if(password === "") {
        inputisValid = true;
        this.setState ({
          passwordError: "Please enter your password."
        });
      }
     if(inputisValid)
      {
        return false;
      }
      else {
        return true;
      }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Animatable.View style={styles.container} ref={ref => (this.containerRef = ref)} useNativeDriver>
          <Text style={styles.logo}>Accountable</Text>
          <View style={styles.inputContainer}>
            <TextField error={this.state.emailError} label="email" onChangeText={ (text: string) => this.setState({email: text})} onFocus={() => this.handleOnFocus()} onSubmitEditing={() => this.handleOnBlur()}/>
            <TextField error={this.state.passwordError} label="password" onChangeText={ (text: string) => this.setState({password: text})} onFocus={() => this.handleOnFocus()} onSubmitEditing={() => this.handleOnBlur()}/>
            <TouchableOpacity onPress={() => this.signInAsync()}>
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Sign In</Text>
              </View>
            </TouchableOpacity> 
            <TouchableOpacity onPress={() => this.navToSignUp()}>
              <Text style={styles.newMember}>new member?</Text>
              <Text style={styles.createAccount}>Create an account here!</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Design.padding,
    paddingTop: Design.padding,
    justifyContent: "space-around",
    backgroundColor: Colors.background,
    //justifyContent: "center",
  },
  logo: {
    fontSize: 50,
    alignSelf: "center",
    color: Colors.primary,
    marginTop: 200
  },
  inputContainer: {
    paddingHorizontal: Design.padding,
    backgroundColor: "#fff",
    borderRadius: Design.roundness,
    marginBottom: 100
  },
  signInText: {
    color: "#fff",
    fontSize: 23
  },
  signInContainer: {
    height: Design.height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Design.roundness,
    marginVertical: Design.height * 0.03
  },
  createAccount: {
    alignItems: "center",
    textAlign: "center",
    textDecorationLine: 'underline'
  },
  newMember: {
    textAlign: "center",
  }
});

export default SignInScreen;
