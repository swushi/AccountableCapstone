import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors, Layout } from "../config";

export interface HabitButtonProps {
  data: any; // will need to be typed later when we have accurate data
}

function HabitButton(props: HabitButtonProps) {
  const iconColor = "red";
  const { name, streak } = props.data;
  return (
    <TouchableOpacity onPress={() => null}>
      <View style={{ ...styles.container, borderBottomColor: "green" }}>
        <Text style={styles.name}>{name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.streak}>{streak}</Text>
          <MaterialCommunityIcons name="fire" size={30} color={iconColor} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    marginHorizontal: Layout.padding,
    marginBottom: Layout.padding,
    padding: Layout.padding,
    ...Colors.shadow
  },
  name: {
    fontSize: 20,
    fontFamily: "Roboto-Regular"
  },
  streak: {
    fontSize: 20,
    fontFamily: "Roboto-Regular"
  }
});

export default HabitButton;
