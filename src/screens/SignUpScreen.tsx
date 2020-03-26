import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { TextField } from "react-native-material-textfield";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as firebase from "../firebase";
import { Layout, Colors, validateEmail } from "../config";
import { User } from "../types";

type SignUpState = {
  err: boolean;
  loading: boolean;
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
  animated: Boolean;
};

type SignUpProps = {
  navigation: any;
};

class SignUpScreen extends Component<SignUpProps, SignUpState> {
  containerRef: any;
  keyboardDidHideListener: any;
  emailRef: any;
  passwordRef: any;
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirm: "",
      firstName: "",
      lastName: "",
      loading: false,
      animated: false,
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

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide.bind(this)
    );
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidHide() {
    this.handleBlur();
  }

  /**
   * Function that is called when any of the inputs are focused
   */
  handleFocus = () => {
    // animate card
    this.state.animated ? null : this.slide("up");

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
    Keyboard.dismiss();
  };

  /**
   * slides the container up or down
   */
  slide = (direction: "up" | "down") => {
    const slideAmount = Layout.height * 0.3;
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
    if (!this.validateInputs()) return;

    // deref
    const { navigate } = this.props.navigation;
    const { firstName, lastName, email, password } = this.state;

    try {
      // set in loading state
      this.setState({ loading: true });

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

      // stop loading
      this.setState({ loading: false });

      // navigate to MainStack upon success
      navigate("App", { screen: "Home" });
    } catch (err) {
      const { code } = err;

      // stop loading
      this.setState({ loading: false });

      if (code === "auth/email-already-in-use") {
        this.setState({ emailErr: "Email already in use" });
      }

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
      lastNameErr,
      loading
    } = this.state;
    const { navigation } = this.props;
    return (
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={{ flex: 1 }}
      >
        <Animatable.View
          animation="zoomIn"
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={35}
              color={Colors.headerText}
            />
          </TouchableOpacity>
          <Text style={styles.logo}>Accountable</Text>
          <View style={styles.inputsContainer}>
            <TextField
              label="First Name"
              value={firstName}
              error={firstNameErr}
              onChangeText={text => this.setState({ firstName: text })}
              baseColor={Colors.background}
              tintColor={Colors.background}
              textColor={Colors.background}
              onFocus={() => this.handleFocus()}
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Last Name"
              value={lastName}
              error={lastNameErr}
              onChangeText={text => this.setState({ lastName: text })}
              baseColor={Colors.background}
              tintColor={Colors.background}
              textColor={Colors.background}
              onFocus={() => this.handleFocus()}
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Email"
              keyboardType="email-address"
              value={email}
              error={emailErr}
              onChangeText={text => this.setState({ email: text })}
              baseColor={Colors.background}
              tintColor={Colors.background}
              textColor={Colors.background}
              onFocus={() => this.handleFocus()}
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Password"
              value={password}
              error={passwordErr}
              onChangeText={text => this.setState({ password: text })}
              baseColor={Colors.background}
              tintColor={Colors.background}
              textColor={Colors.background}
              onFocus={() => this.handleFocus()}
              secureTextEntry
              onSubmitEditing={() => this.handleBlur()}
            />
            <TextField
              label="Confirm Password"
              value={confirm}
              error={confirmErr}
              onChangeText={text => this.setState({ confirm: text })}
              baseColor={Colors.background}
              tintColor={Colors.background}
              textColor={Colors.background}
              onFocus={() => this.handleFocus()}
              secureTextEntry
              onSubmitEditing={() => this.handleBlur()}
            />
            <TouchableOpacity onPress={this.signUpAsync}>
              <View style={styles.loginContainer}>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.loginText}>Login</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: Layout.padding,
    justifyContent: "space-around"
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 15
  },
  logo: {
    fontSize: 50,
    alignSelf: "center",
    color: Colors.background
  },
  inputsContainer: {
    paddingHorizontal: Layout.padding,
    borderRadius: Layout.roundness
  },
  loginContainer: {
    height: Layout.height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Layout.roundness,
    marginVertical: Layout.height * 0.03
  },
  loginText: {
    color: "#fff",
    fontSize: 23
  }
});

export default SignUpScreen;
