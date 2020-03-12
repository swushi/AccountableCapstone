import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import stacks and screens
import MainStack from "./MainStack";
import MessagesStack from "./MessagesStack";
import { ProfileScreen } from "../screens";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen name="Main" component={MainStack} />
      <Tab.Screen name="Messages" component={MessagesStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
