import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ImageBackground } from "react-native";
import { Header, PresetHabitListItem } from "../components";
import { Layout, Colors } from "../config";
export interface PresetHabitScreenProps {}

export default (props: PresetHabitScreenProps) => {
  const [habits, setHabits] = useState(presetItems);
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Header hideBack />
        <FlatList
          data={habits}
          keyExtractor={item => item.name}
          renderItem={({ item }) =>  (
            <PresetHabitListItem
              icon={item.icon}
              name={item.name}
              desc={item.desc}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
});

const presetItems = [
  {
    icon: "book",
    name: "Studying",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    icon: "food-apple",
    name: "Eating Healthy",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    icon: "weight",
    name: "Going to the Gym",
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];
