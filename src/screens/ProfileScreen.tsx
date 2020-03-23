import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
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
      <View>
        <Header hideBack/>

        <Text style={styles.notify}> Notifications </Text>
        <Text style={styles.signOut}> Sign Out </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: Layout.padding,
    justifyContent: "space-around",
    backgroundColor: Colors.background
    //justifyContent: "center",
  },
  notify: {
    
  },
  signOut: {

  }
});
export default ProfileScreen;
