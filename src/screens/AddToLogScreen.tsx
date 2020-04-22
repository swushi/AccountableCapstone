import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextField } from "react-native-material-textfield";
import * as firebase from "../firebase";
import { Header } from "../components";
import { Layout, Colors } from "../config";

interface Props {
  navigation: any;
  route: any;
}

interface State {
  value: string;
}

class AddToLogScreen extends Component<Props, State> {
  state = {
    value: "",
  };

  async submit() {
    const { habitId, notes } = this.props.route.params;
    const { navigation } = this.props;
    const { updateHabit } = firebase;
    const date = new Date();
    const readableTime = date.toDateString();
    const note = {
      note: this.state.value,
      time: readableTime,
    };
    let newNotes = notes;
    newNotes.unshift(note);
    console.log(newNotes);
    try {
      await updateHabit(habitId, { notes: newNotes });
      navigation.goBack();
    } catch (err) {
      firebase.logError({
        screen: "AddToLogScreen",
        function: "submit()",
        error: err,
      });
    }
  }

  render() {
    const { value } = this.state;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "height" : "padding"}
      >
        <Header />
        <View style={styles.contentContainer}>
          <Text style={styles.labelText}>
            Keep track of what you've been up to!
          </Text>
          <TextField
            autoFocus
            tintColor={Colors.primary}
            multiline
            label="Add to your log"
            value={value}
            onChangeText={(text) => this.setState({ value: text })}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={() => this.submit()}>
          <Text style={styles.buttonText}>Add to your log</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: Layout.padding,
  },
  labelText: {
    color: Colors.textPrimary,
    fontSize: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    height: Layout.height * 0.05,
    margin: Layout.padding,
    borderRadius: Layout.roundness,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    color: Colors.primary,
  },
});

export default AddToLogScreen;
