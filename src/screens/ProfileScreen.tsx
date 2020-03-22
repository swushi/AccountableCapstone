import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Design, Colors, validateEmail } from "../config";
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
        <Animatable.View
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <View style={styles.topBar}>
            <Text style={styles.headerText}> Accountable</Text>
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
    //justifyContent: "center",
  },
  topBar: {
    //headerStyle:
  },
  headerText: {
      fontSize: 20,
      textAlign: "center",
      margin: 10,
      fontWeight: "bold"
  }
});
export default ProfileScreen;
