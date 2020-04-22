import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import {
  HomeScreen,
  CreateHabitScreen,
  PresetHabitScreen,
  SelectAccountableScreen,
  HabitScreen,
  EditHabitScreen,
  AddToLogScreen,
} from "../screens";

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator initialRouteName="Home" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Habit" component={HabitScreen} />
      <Stack.Screen name="CreateHabit" component={CreateHabitScreen} />
      <Stack.Screen name="PresetHabit" component={PresetHabitScreen} />
      <Stack.Screen
        name="SelectAccountable"
        component={SelectAccountableScreen}
      />
      <Stack.Screen name="EditHabit" component={EditHabitScreen} />
      <Stack.Screen name="AddToLog" component={AddToLogScreen} />
    </Stack.Navigator>
  );
}
