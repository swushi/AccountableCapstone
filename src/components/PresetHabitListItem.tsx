import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Colors, Layout } from "../config";

export interface PresetHabitListItemProps {
  name: string;
  desc: string;
  icon: string;
}

export default (props: PresetHabitListItemProps) => {
  const { icon, name, desc } = props;
  const [descHeight, setDescHeight] = useState(0);
  const hiddenRef = useRef();
  // console.warn("Render", name);

  const showDesc = () => {
    console.log("show desc", descHeight);
    hiddenRef.current.transitionTo({ height: descHeight });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.shownContainer} onPress={showDesc}>
        <View style={styles.leftSideShownContainer}>
          <MaterialCommunityIcons
            name={icon}
            size={30}
            color={Colors.primary}
          />
          <Text style={styles.name}>{name}</Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color={Colors.primary}
        />
      </TouchableOpacity>
      <Animatable.View
        ref={hiddenRef}
        style={{ ...styles.hiddenContainer, overflow: "hidden" }}
      >
        <View onLayout={e => console.log(e.nativeEvent.layout.height)}>
          <Text style={styles.desc}>{desc}</Text>
        </View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Layout.padding
  },
  shownContainer: {
    padding: Layout.padding,
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between"
  },
  leftSideShownContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  name: {
    paddingLeft: Layout.padding
  }
});
