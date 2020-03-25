import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { Colors, Layout } from "../config";

// TODO: GET THIS ITS OWN SCREEN
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
    console.log("show desc asdf", descHeight);
    hiddenRef.current.transitionTo({ height: descHeight });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDesc}>
        <View style={styles.shownContainer}>
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
        </View>
      </TouchableOpacity>
      <Animatable.View
        ref={hiddenRef}
        style={{ ...styles.hiddenContainer, height: 0, overflow: "hidden" }}
      >
        <Text style={styles.desc}>{desc}</Text>
      </Animatable.View>

      {/**
       * Needed to get dynamic height of paragraph
       */}
      <Text
        style={{ ...styles.desc, opacity: 0, position: "absolute", top: 1000 }}
        onLayout={e => setDescHeight(e.nativeEvent.layout.height)}
      >
        {desc}
      </Text>
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
  },
  hiddenContainer: {
    borderWidth: 1,
    marginHorizontal: Layout.padding * 3
  }
});
