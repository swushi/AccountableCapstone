import * as React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";

type SignInScreenProps = {
  navigation: any;
};

type SignInScreenState = {};

class SignInScreen extends React.Component<
  SignInScreenProps,
  SignInScreenState
> {
  constructor(props: SignInScreenProps) {
    super(props);
    this.state = {};
  }

  handlePress = () => {
    this.props.navigation.navigate("SignUp");
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.handlePress()}>
          <Text>SignInScreen Component</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default SignInScreen;
