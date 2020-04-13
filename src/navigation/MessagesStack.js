import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { MessagesScreen, ChatScreen } from "../screens";

const Stack = createStackNavigator();

export default function MessagesStack() {
  return (
    <Stack.Navigator initialRouteName="PresetHabit" headerMode="none">
      <Stack.Screen name="Messages" component={MessagesScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
