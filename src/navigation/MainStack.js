import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen, CreateHabitScreen, PresetHabitScreen } from "../screens";

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
      <Stack.Screen name="PresetHabit" component={PresetHabitScreen} />
    </Stack.Navigator>
  );
}
