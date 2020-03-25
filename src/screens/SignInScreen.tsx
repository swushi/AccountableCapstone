import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActionSheetIOS
} from "react-native";
import { connect } from "react-redux";
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
};

class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  containerRef: any;
  constructor(props: SignInScreenProps) {
    super(props);
    this.state = {
      email: "test@gmail.com",
      password: "password",
      error: null,
      emailError: null,
      passwordError: null
    };
    this.signInAsync = this.signInAsync.bind(this);
    this.containerRef = null;
  }
  componentDidMount() {
    console.log(this.props);
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
    const slideAmount = Layout.height * 0.3;
    const translation = direction === "up" ? -1 * slideAmount : 0;
    this.containerRef.transitionTo({
      transform: [{ translateY: translation }]
    });
  };

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
      <Animatable.View
        style={styles.container}
        ref={ref => (this.containerRef = ref)}
        useNativeDriver
      >
        <Text style={styles.logo}>Accountable</Text>
        <View style={styles.inputContainer}>
          <TextField
            tintColor={Colors.primary}
            textColor={Colors.textPrimary}
            error={this.state.emailError}
            label="email"
            onChangeText={(text: string) => this.setState({ email: text })}
            onFocus={() => this.handleOnFocus()}
            onSubmitEditing={() => this.handleOnBlur()}
          />
          <TextField
            tintColor={Colors.primary}
            textColor={Colors.textPrimary}
            error={this.state.passwordError}
            secureTextEntry={true}
            label="password"
            onChangeText={(text: string) => this.setState({ password: text })}
            onFocus={() => this.handleOnFocus()}
            onSubmitEditing={() => this.handleOnBlur()}
          />
          <TouchableOpacity onPress={() => this.signInAsync()}>
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Sign In</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navToSignUp()}>
            <Text style={styles.createAccount}>
              New member? Create an account here!
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navToPasswordReset()}>
            <Text style={styles.Forgot}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>
    );
  }
}

// TODO: Restyle this screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: Layout.padding,
    justifyContent: "space-around",
    backgroundColor: Colors.background
    //justifyContent: "center",
  },

  logo: {
    fontSize: 50,
    alignSelf: "center",
    color: Colors.primary,
    marginTop: 200
  },

  inputContainer: {
    padding: Layout.padding,
    backgroundColor: "#fff",
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
    alignItems: "center",
    textAlign: "center",
    textDecorationLine: "underline"
  },
  Forgot: {
    textAlign: "center",
    color: Colors.primary,
    fontStyle: "italic",
    fontWeight: "bold"
  }
});

export default connect(null, actions)(SignInScreen);
