import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Layout, Colors, validateEmail } from "../config";
import * as firebase from "../firebase";
import * as Animatable from "react-native-animatable";
import { TextField } from "react-native-material-textfield";

type ForgotPasswordScreenProps = {
  navigation: any;
};

type ForgotPasswordScreenState = {
  email: string;
  error: boolean;
  loading: boolean;
  emailError: any;
  animated: boolean;
};

class ForgotPasswordScreen extends React.Component<
  ForgotPasswordScreenProps,
  ForgotPasswordScreenState
> {
  keyboardDidHideListener: any;
  containerRef: any;
  constructor(props: ForgotPasswordScreenProps) {
    super(props);
    this.state = {
      email: "",
      error: null,
      emailError: null,
      loading: false,
      animated: false
    };
    this.PasswordResetAsync = this.PasswordResetAsync.bind(this);
    this.containerRef = null;
  }
  validateInput = () => {
    const { email } = this.state;
    let inputisValid = false;

    if (!validateEmail(email)) {
      inputisValid = true;
      this.setState({
        emailError: "Please enter a valid email."
      });
    }

    if (inputisValid) {
      return false;
    } else {
      return true;
    }
  };

  /**
   * slides the container up or down
   */
  slide = (direction: "up" | "down") => {
    this.setState({ animated: direction === "up" ? true : false });

    const slideAmount = Layout.height * 0.3;
    const translation = direction === "up" ? -1 * slideAmount : 0;

    this.containerRef.transitionTo({
      transform: [{ translateY: translation }]
    });
  };

  handleFocus = () => {
    // animate card
    !this.state.animated ? this.slide("up") : null;

    // reset error states
    this.setState({
      emailError: null
    });
  };

  handleBlur = () => {
    this.slide("down");
    Keyboard.dismiss();
  };

  PasswordResetAsync = async () => {
    // validate inputs and produce errors before communication with backend
    if (!this.validateInput()) return;

    // deref
    const { navigate } = this.props.navigation;
    const { email } = this.state;

    try {
      // set in loading state
      this.setState({ loading: true });

      // Sign up user

      await firebase.passwordReset(email);
      console.log("Password reset email was sent successfully");
      alert(
        "Please check your email and follow instructions to reset your  password"
      );
      this.setState({ loading: false });

      //upon success user is directed back to the Sign In page
      navigate("SignIn");
    } catch (error) {
      const { code } = error;

      // stop loading
      this.setState({ loading: false });
      if (code === "auth/user-not-found") {
        this.setState({
          emailError:
            "Email doesn't exist in our database. Please enter a valid email"
        });
      }

      // set error in state
      this.setState({ error });
    }
  };

  componentDidMount() {
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardDidHide.bind(this)
    );
  }

  keyboardDidHide() {
    if (this.state.animated) {
      Keyboard.dismiss();
      this.handleBlur();
    }
  }

  render() {
    const { email, emailError, loading } = this.state;
    const { navigation } = this.props;
    return (
      <LinearGradient
        colors={[Colors.primary, Colors.secondary]}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1 }}>
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
            <View style={styles.inputContainer}>
              <TextField
                label="E-mail"
                keyboardType="email-address"
                value={email}
                error={emailError}
                onChangeText={text => this.setState({ email: text })}
                baseColor={Colors.background}
                tintColor={Colors.background}
                textColor={Colors.background}
                onFocus={() => this.handleFocus()}
                onSubmitEditing={() => this.handleBlur()}
              />

              <TouchableOpacity onPress={() => this.PasswordResetAsync()}>
                <View style={styles.SendEmailContainer}>
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.sendEmailtext}>Send Email</Text>
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </Animatable.View>
        </View>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: Layout.padding,
    justifyContent: "flex-start"
  },

  logo: {
    fontSize: 50,
    alignSelf: "center",
    color: Colors.background,
    marginTop: 300
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 15
  },
  inputContainer: {
    paddingHorizontal: Layout.padding,
    borderRadius: Layout.roundness,
    marginBottom: 100
  },

  SendEmail: {
    color: "#fff",
    fontSize: 23
  },
  sendEmailtext: {
    color: "#fff",
    fontSize: 21
  },
  SendEmailContainer: {
    height: Layout.height * 0.06,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: Layout.roundness,
    marginVertical: Layout.height * 0.03
  }
});

export default ForgotPasswordScreen;
