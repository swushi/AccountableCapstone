import * as React from "react";
import { View, StyleSheet, Text } from "react-native";

export interface CreateHabitScreenProps {}

export interface CreateHabitScreenState {}

class CreateHabitScreen extends React.Component<
  CreateHabitScreenProps,
  CreateHabitScreenState
> {
  render() {
    return (
      <View>
        <Text>CreateHabitScreen Component</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {}
});

export default CreateHabitScreen;
