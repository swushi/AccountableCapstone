import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import * as Animatable from "react-native-animatable";
import { Header, HabitButton } from "../components";
import { Layout, Colors } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface HomeScreenProps {}

export interface HomeScreenState {}

class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> {
  state = {
    habits: HABITS,
    createWidth: 0,
    breakWidth: 100,
    createHeight: 0,
    breakHeight: 0,
    animated: false
  };
  createRef = null;
  breakRef = null;
  fabRef = null;

  handleFab() {
    const { animated } = this.state;

    animated ? this.slideOutActions() : this.slideInActions();
  }

  slideInActions() {
    const { createWidth, breakWidth, createHeight, breakHeight } = this.state;
    this.setState({ animated: true });
    this.fabRef.transitionTo({
      rotate: "45deg"
    });
    this.createRef.transitionTo({
      transform: [{ translateX: -createWidth * 1.2 }]
    });
    setTimeout(
      () =>
        this.breakRef.transitionTo({
          transform: [{ translateX: -breakWidth * 1.2 }]
        }),
      100
    );
  }

  slideOutActions() {
    const { createWidth, breakWidth, createHeight, breakHeight } = this.state;
    this.setState({ animated: false });
    this.fabRef.transitionTo({
      rotate: "0deg"
    });
    this.createRef.transitionTo({
      transform: [{ translateX: 0 }]
    });
    setTimeout(
      () =>
        this.breakRef.transitionTo({
          transform: [{ translateX: 0 }]
        }),
      100
    );
  }

  render() {
    const { habits, breakWidth } = this.state;
    return (
      <View style={styles.container}>
        <Header hideBack />
        <View style={styles.contentContainer}>
          <View style={styles.progressCircleContainer}></View>
          <Text style={styles.currentHabitsText}>Current Habits</Text>
          <FlatList
            data={habits}
            keyExtractor={item => item.name}
            renderItem={({ item }) => <HabitButton data={item} />}
          />
          <TouchableOpacity
            style={styles.floatingActionButtonContainer}
            onPress={() => this.handleFab()}
          >
            <Animatable.View
              ref={ref => (this.fabRef = ref)}
              useNativeDriver
              style={{ transform: [{ rotate: "0deg" }] }}
            >
              <MaterialCommunityIcons
                name="plus-circle"
                size={50}
                color={Colors.primary}
              />
            </Animatable.View>
          </TouchableOpacity>
          <View
            style={{
              ...styles.actionOptionsContainer,
              bottom: 65,
              right: -breakWidth
            }}
          >
            <TouchableOpacity>
              <Animatable.View
                useNativeDriver
                onLayout={({ nativeEvent }) =>
                  this.setState({
                    breakWidth: nativeEvent.layout.width,
                    breakHeight: nativeEvent.layout.height
                  })
                }
                ref={ref => (this.createRef = ref)}
                style={{
                  ...styles.actionOptionContainer,
                  borderColor: Colors.good
                }}
              >
                <Text style={styles.actionText}>Create Habit</Text>
              </Animatable.View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Animatable.View
                useNativeDriver
                onLayout={({ nativeEvent }) =>
                  this.setState({
                    createWidth: nativeEvent.layout.width,
                    createHeight: nativeEvent.layout.height
                  })
                }
                ref={ref => (this.breakRef = ref)}
                style={{
                  ...styles.actionOptionContainer,
                  borderColor: Colors.bad
                }}
              >
                <Text style={styles.actionText}>Break Habit</Text>
              </Animatable.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1
  },
  progressCircleContainer: {
    height: Layout.height * 0.23,
    width: Layout.height * 0.23,
    borderRadius: 100,
    alignSelf: "center",
    margin: Layout.padding,

    // temp
    backgroundColor: Colors.primary
  },
  currentHabitsText: {
    fontFamily: "Roboto-Regular",
    alignSelf: "center",
    fontSize: 30,
    color: Colors.textPrimary,
    padding: Layout.padding
  },
  floatingActionButtonContainer: {
    position: "absolute",
    bottom: 15,
    right: 15
  },
  actionOptionsContainer: {
    position: "absolute"
  },
  actionOptionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderRadius: Layout.roundness,
    backgroundColor: "#fff",
    marginBottom: 5
  },
  actionText: {
    fontSize: 16,
    fontFamily: "Roboto-Regular"
  }
});

export default HomeScreen;

const HABITS = [
  {
    name: "Gym",
    streak: 8
  },
  {
    name: "Smoking",
    streak: 33
  },
  {
    name: "Games",
    streak: 176
  }
];
