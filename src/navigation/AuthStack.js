import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import { SignInScreen, SignUpScreen, ForgotPasswordScreen } from "../screens";

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="SignIn" headerMode="none">
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

    </Stack.Navigator>
  );
}
