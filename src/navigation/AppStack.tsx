import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { HomeScreen } from "../screens";

const Stack = createStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn" headerMode="none">
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}
