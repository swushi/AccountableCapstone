import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { TextField } from "react-native-material-textfield";
import * as firebase from "../firebase";
import { Layout, Colors, validateEmail } from "../config";
import * as actions from "../redux/actions";
import { User } from "../types";

type SignInScreenProps = {
  navigation: any;
  storeUser: any;
};

type SignInScreenState = {
  email: string;
  password: string;
  error: boolean;
  emailError: any;
  passwordError: any;
  animated: Boolean;
};

class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  containerRef: any;
  emailRef: any;
  constructor(props: SignInScreenProps) {
    super(props);
    this.state = {
      animated: false,
      email: "test@gmail.com",
      password: "password",
      error: null,
      emailError: null,
      passwordError: null
    };
    this.signInAsync = this.signInAsync.bind(this);
    this.containerRef = null;
    this.emailRef = null;
  }

  componentDidMount() {
    this.emailRef.blur();
  }

  handleOnFocus = () => {
    !this.state.animated ? this.slideUp() : null;
    this.setState({
      emailError: null,
      passwordError: null
    });
  };

  handleOnBlur = () => {
    console.log("slide");
    this.slideDown();
  };

  slideDown() {
    this.setState({ animated: false });
    const slideAmount = Layout.height * 0.3;
    const translation = slideAmount * 0;
    this.containerRef.transitionTo({
      transform: [{ translateY: translation }]
    });
  }

  slideUp() {
    if (this.state.animated) return;
    this.setState({ animated: true });
    const slideAmount = Layout.height * 0.3;
    const translation = slideAmount * -1;
    this.containerRef.transitionTo(
      {
        transform: [{ translateY: translation }]
      },
      500
    );
    setTimeout(() => this.emailRef.focus(), 100);
  }

  navToSignUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  navToPasswordReset = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  handlePress = async () => {
    try {
      // handle sign up
      await this.signInAsync();

      // navigate if okay
      this.props.navigation.navigate("App");
    } catch (err) {}
  };

  signInAsync = async () => {
    // deref
    const { navigate } = this.props.navigation;
    const { storeUser } = this.props;
    const { email, password, error } = this.state;

    if (!this.validateInput()) {
      return;
    }
    try {
      // Sign in user
      const signIn = await firebase.signIn(email, password);

      // retrieve users data from database
      const userData = await firebase.getUser(firebase.uid());

      storeUser(userData.data());

      this.props.navigation.navigate("App");
    } catch (error) {
      alert(error);
      const { code } = error;
      if (code === "auth/user-not-found") {
        this.setState({ emailError: "Please enter a valid email" });
      }
      if (code === "auth/wrong-password") {
        this.setState({ passwordError: "Please enter a valid password" });
      }
      // set error in state
      //this.setState({ emailError: error });
    }
  };

  validateInput = () => {
    const { email, password } = this.state;
    let inputisValid = false;

    if (!validateEmail(email)) {
      inputisValid = true;
      this.setState({
        emailError: "Please enter a valid email."
      });
    }

    if (password === "") {
      inputisValid = true;
      this.setState({
        passwordError: "Please enter your password."
      });
    }
    if (inputisValid) {
      return false;
    } else {
      return true;
    }
  };

  render() {
    return (
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={{ flex: 1 }}
      >
        <View>
          <Animatable.View
            style={styles.inputContainer}
            ref={ref => (this.containerRef = ref)}
            useNativeDriver
          >
            <Text style={styles.logo}>Accountable</Text>
            <View>
              <TextField
                tintColor={Colors.background}
                textColor={Colors.background}
                baseColor={Colors.background}
                error={this.state.emailError}
                label="Email"
                onChangeText={(text: string) => this.setState({ email: text })}
                onFocus={() => this.handleOnFocus()}
                onSubmitEditing={() => this.handleOnBlur()}
                ref={ref => (this.emailRef = ref)}
              />
            </View>
            <View>
              <TextField
                tintColor={Colors.background}
                textColor={Colors.background}
                baseColor={Colors.background}
                error={this.state.passwordError}
                secureTextEntry={true}
                label="Password"
                onChangeText={(text: string) =>
                  this.setState({ password: text })
                }
                onFocus={() => this.handleOnFocus()}
                onSubmitEditing={() => this.handleOnBlur()}
              />
            </View>
            <TouchableOpacity onPress={() => this.signInAsync()}>
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Login</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.navToPasswordReset()}>
              <Text style={styles.Forgot}>Forgot Password?</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
        <TouchableOpacity onPress={() => this.navToSignUp()}>
          <Text style={styles.createAccount}>
            New member? Create an account here!
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}

// TODO: Restyle this screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.padding,
    justifyContent: "space-around"
    //justifyContent: "center",
  },

  logo: {
    fontSize: 50,
    alignSelf: "center",
    color: Colors.background,
    marginTop: 150,
    marginBottom: 100
  },

  inputContainer: {
    padding: Layout.padding,
    borderRadius: Layout.roundness,
    marginBottom: 100
  },

  signInText: {
    color: "#fff",
    fontSize: 23
  },

  signInContainer: {
    height: Layout.height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Layout.roundness,
    marginVertical: Layout.height * 0.03
  },

  createAccount: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    textAlign: "center",
    textDecorationLine: "underline",
    color: Colors.background
  },
  Forgot: {
    textAlign: "center",
    color: Colors.background,
    fontStyle: "italic",
    fontWeight: "bold"
  }
});

export default connect(null, actions)(SignInScreen);
