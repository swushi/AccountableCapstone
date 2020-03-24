import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Layout, Colors, validateEmail } from "../config";
import { Header } from "../components";
import * as Animatable from "react-native-animatable";

export interface ProfileScreenProps {}

export interface ProfileScreenState {}

class ProfileScreen extends React.Component<
  ProfileScreenProps,
  ProfileScreenState
> {
  containerRef: any;
  constructor(props: ProfileScreenProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header hideBack/>
        <Animatable.View
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity>
              <View style={styles.notifyContainer}>
                <Text style={styles.notifyText}> Notifications </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.signOutContainer}>
              <Text style={styles.signOutText}> Sign Out </Text>
            </View>
          </View>
        </Animatable.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: Layout.padding,
    backgroundColor: "#fff",
    borderRadius: Layout.roundness,
    //marginBottom: 50,
    marginTop: 250
  },
  notifyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: Layout.roundness,
    backgroundColor: "#fff",
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
});
export default ProfileScreen;
