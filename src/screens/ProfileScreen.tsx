import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  Switch,
  Animated,
  TouchableOpacity
} from "react-native";
import { Layout, Colors, validateEmail } from "../config";
import { Header, ToggleButton } from "../components";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import * as firebase from "../firebase";
import * as actions from "../redux/actions";
import { User } from "../types";

export interface ProfileScreenProps {
  navigation: any;
  canNotify: Function;
}

export interface ProfileScreenState {
  notify: any;
}

class ProfileScreen extends React.Component<
  ProfileScreenProps,
  ProfileScreenState
> {
  containerRef: any;
  constructor(props: ProfileScreenProps) {
    super(props);
    this.state = {
      notify: true
    };
  }

  componentWillMount() {
    // TODO: pull notify from database for user
    // update state
  }

  componentDidMount() {
    console.log(this.props);
  }

  signOutAsync = async () => {
    const signIn = await firebase.signOut();
    this.navToSignIn();
  };
  navToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  toggleHandle = value => {
    this.setState({ notify: value });
    // update redux value
    this.props.canNotify("test");
  };

  render() {
    const { notify } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header hideBack />
        <Animatable.View
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <View style={styles.inputContainer}>
            <View style={styles.profileCircle}></View>
            <Text style={styles.userText}> User </Text>
            <TouchableOpacity onPress={() => this.toggleHandle(!notify)}>
              <View style={styles.notifyContainer} pointerEvents="none">
                <ToggleButton isOn={notify} />
                <Text style={styles.notifyText}> Notifications </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.signOutAsync()}>
              <View style={styles.signOutContainer}>
                <MaterialCommunityIcons
                  style={styles.exitSign}
                  name="exit-to-app"
                  size={30}
                />
                <Text style={styles.signOutText}> Sign Out </Text>
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
    flex: 1
  },
  inputContainer: {
    paddingHorizontal: Layout.padding,
    backgroundColor: "#fff",
    borderRadius: Layout.roundness,
    marginTop: 20
  },
  profileCircle: {
    height: Layout.height * 0.23,
    width: Layout.height * 0.23,
    borderRadius: 100,
    alignSelf: "center",
    margin: Layout.padding,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: Colors.primary,
    marginBottom: 40
  },
  userText: {
    fontSize: 40,
    fontFamily: "Roboto-Regular",
    alignSelf: "center",
    color: Colors.textPrimary,
    marginBottom: 20
  },
  notifyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: Layout.roundness,
    backgroundColor: "#fff",
    marginTop: 20,
    marginBottom: 20
  },
  notifyText: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    alignSelf: "flex-start",
    color: Colors.textPrimary,
    padding: Layout.padding
  },
  signOutContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: Layout.roundness,
    backgroundColor: "#fff",
    marginBottom: 5
  },
  signOutText: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    alignSelf: "flex-start",
    color: Colors.textPrimary,
    padding: Layout.padding
  },
  exitSign: {
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 30,
    marginBottom: -30
  }
});

const mapStateToProps = state => ({ notify: state.notify });

export default connect(mapStateToProps, actions)(ProfileScreen);
