import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Animatable from "react-native-animatable";
import { TextField } from "react-native-material-textfield";
import * as firebase from "../firebase";
import { Design, Colors, validateEmail } from "../config";
import { User } from "../types";

type SignUpState = {
  err: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
  firstNameErr: any;
  lastNameErr: any;
  emailErr: any;
  passwordErr: any;
  confirmErr: any;
};

type SignUpProps = {
  navigation: any;
};

class SignUpScreen extends Component<SignUpProps, SignUpState> {
  containerRef: any;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirm: "",
      firstName: "",
      lastName: "",

      // error handlers
      err: null,
      firstNameErr: null,
      lastNameErr: null,
      emailErr: null,
      passwordErr: null,
      confirmErr: null
    };
    this.signUpAsync = this.signUpAsync.bind(this);
    this.containerRef = null;
  }

  /**
   * Function that is called when any of the inputs are focused
   */
  handleFocus = () => {
    // animate card
    this.slide("up");

    // reset error states
    this.setState({
      firstNameErr: null,
      lastNameErr: null,
      emailErr: null,
      passwordErr: null,
      confirmErr: null
    });
  };

  handleBlur = () => {
    this.slide("down");
  };

  /**
   * slides the container up or down
   */
  slide = (direction: "up" | "down") => {
    const slideAmount = Design.height * 0.3;
    const translation = direction === "up" ? -1 * slideAmount : 0;

    this.containerRef.transitionTo({
      transform: [{ translateY: translation }]
    });
  };

  /**
   * Sign ups the user through firebase auth
   */
  signUpAsync = async () => {
    // validate inputs and produce errors before communication with backend
    if (!this.validateInputs()) {
      console.log("error in one text");
      return;
    }
    // deref
    const { navigate } = this.props.navigation;
    const { firstName, lastName, email, password, confirm, err } = this.state;

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
        firstName,
        lastName
      };

      // Initialize user in database
      const createUser = firebase.createUser(User);

      // Store user globally in Redux
      // storeUser(User);

      // wait for async signIn and createUser to finish
      await Promise.all([signIn, createUser]);

      // navigate to MainStack upon success
      navigate("Main");
    } catch (err) {
      console.log("SIGNUP ERROR", err.code);

      // set error in state
      this.setState({ err });
    }
  };

  /**
   * Validates each input and shows error if any fail
   */
  validateInputs = () => {
    const { firstName, lastName, email, password, confirm } = this.state;
    let err = false;

    if (firstName === "") {
      this.setState({
        firstNameErr: "Please enter valid First Name"
      });
      err = true;
    }

    if (lastName === "") {
      this.setState({
        lastNameErr: "Please enter valid Last Name"
      });
      err = true;
    }
    if (!validateEmail(email)) {
      this.setState({
        emailErr: "Please enter valid Email Address"
      });
      err = true;
    }
    if (password !== confirm) {
      this.setState({
        passwordErr: "These passwords must match",
        confirmErr: "These passwords must match"
      });
      err = true;
    }
    if (password.length <= 6) {
      this.setState({
        passwordErr: "Password must be greater than 6 characters"
      });
      err = true;
    }

    if (err) return false;
    else return true;
  };

  render() {
    const {
      email,
      password,
      confirm,
      firstName,
      lastName,
      emailErr,
      passwordErr,
      confirmErr,
      firstNameErr,
      lastNameErr
    } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Animatable.View
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <Text style={styles.logo}>Accountable</Text>
          <View style={styles.inputsContainer}>
            <TextField
              label="First Name"
              value={firstName}
              error={firstNameErr}
              onChangeText={text => this.setState({ firstName: text })}
              tintColor={Colors.primary}
              textColor={Colors.textPrimary}
              onFocus={() => this.handleFocus()}
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Last Name"
              value={lastName}
              error={lastNameErr}
              onChangeText={text => this.setState({ lastName: text })}
              tintColor={Colors.primary}
              textColor={Colors.textPrimary}
              onFocus={() => this.handleFocus()}
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Email"
              keyboardType="email-address"
              value={email}
              error={emailErr}
              onChangeText={text => this.setState({ email: text })}
              tintColor={Colors.primary}
              textColor={Colors.textPrimary}
              onFocus={() => this.handleFocus()}
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Password"
              value={password}
              error={passwordErr}
              onChangeText={text => this.setState({ password: text })}
              tintColor={Colors.primary}
              textColor={Colors.textPrimary}
              onFocus={() => this.handleFocus()}
              secureTextEntry
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Confirm Password"
              value={confirm}
              error={confirmErr}
              onChangeText={text => this.setState({ confirm: text })}
              tintColor={Colors.primary}
              textColor={Colors.textPrimary}
              onFocus={() => this.handleFocus()}
              secureTextEntry
              onSubmitEditing={() => this.handleBlur()}
            />
            <TouchableOpacity onPress={this.signUpAsync}>
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Login</Text>
              </View>
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
    backgroundColor: Colors.background
  },
  logo: {
    fontSize: 50,
    alignSelf: "center",
    color: Colors.primary
  },
  inputsContainer: {
    paddingHorizontal: Design.padding,
    backgroundColor: "#fff",
    borderRadius: Design.roundness
  },
  loginContainer: {
    height: Design.height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Design.roundness,
    marginVertical: Design.height * 0.03
  },
  loginText: {
    color: "#fff",
    fontSize: 23
  }
});

export default SignUpScreen;
