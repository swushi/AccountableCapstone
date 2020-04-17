import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import * as firebase from "../firebase";
import * as Animatable from "react-native-animatable";
import { Header, HabitButton } from "../components";
import { Layout, Colors } from "../config";
import { ProgressCircle } from "react-native-svg-charts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Habit } from "../types";
const AnimatableTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity
);

export interface HomeScreenProps {
  navigation: any;
}

export interface HomeScreenState {
  habits: Habit[];
  createWidth: number;
  breakWidth: number;
  createHeight: number;
  breakHeight: number;
  animated: boolean;
}

class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> {
  state = {
    habits: [],
    createWidth: 0,
    breakWidth: 100,
    createHeight: 0,
    breakHeight: 0,
    animated: false,
  };
  habitListener = null;
  contentRef = null;
  createRef = null;
  breakRef = null;
  fabRef = null; // floating action button

  handleAction(screen: "CreateHabit" | "PresetHabit") {
    this.slideOutActions();
    this.props.navigation.navigate(screen);
  }

  handleFab() {
    const { animated } = this.state;

    animated ? this.slideOutActions() : this.slideInActions();
  }

  slideInActions() {
    const { createWidth, breakWidth, createHeight, breakHeight } = this.state;
    this.setState({ animated: true });
    this.contentRef.transitionTo({ opacity: 0.5 }, 500);
    this.fabRef.transitionTo(
      {
        rotate: "45deg",
      },
      500
    );
    this.createRef.transitionTo({
      transform: [{ translateX: -createWidth * 2.2 }],
    });
    setTimeout(
      () =>
        this.breakRef.transitionTo({
          transform: [{ translateX: -breakWidth * 2.2 }],
        }),
      100
    );
  }

  slideOutActions() {
    const { createWidth, breakWidth, createHeight, breakHeight } = this.state;
    this.setState({ animated: false });
    this.contentRef.transitionTo({ opacity: 1 }, 500);
    this.fabRef.transitionTo(
      {
        rotate: "0deg",
      },
      500
    );
    this.createRef.transitionTo({
      transform: [{ translateX: 0 }],
    });
    setTimeout(
      () =>
        this.breakRef.transitionTo({
          transform: [{ translateX: 0 }],
        }),
      100
    );
  }

  async getHabitList() {
    this.habitListener = await firebase.getHabits(firebase.uid(), (habits) =>
      this.setState({ habits })
    );
  }

  componentDidMount() {
    this.getHabitList();
  }

  componentWillUnmount() {
    this.habitListener();
  }

  render() {
    const { habits, breakWidth, animated } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Animatable.View
          ref={(ref) => (this.contentRef = ref)}
          style={{ ...styles.contentContainer }}
          pointerEvents={animated ? "none" : "auto"}
        >
          <Header hideBack />

          <View>
            <ProgressCircle
              style={styles.progressCircleContainer}
              progress={1} // TODO: get this from habit streaks
              startAngle={-Math.PI * 0.8}
              endAngle={Math.PI * 0.8}
              strokeWidth={15}
              progressColor={Colors.primary} // TODO: progress < 70% make orange, progress > 70% make green, progress < 50% make red
            />
            <View style={styles.progressPercentage}>
              <Text style={styles.percentageText}>100%</Text>
              <Text style={styles.percentageLabel}>Consistency</Text>
            </View>
          </View>
          <Text style={styles.currentHabitsText}>Current Habits</Text>
          <FlatList
            data={habits}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <HabitButton
                data={item}
                onPress={() => navigate("Habit", item)}
              />
            )}
          />
        </Animatable.View>
        <TouchableOpacity
          style={styles.floatingActionButtonContainer}
          onPress={() => this.handleFab()}
        >
          <Animatable.View
            ref={(ref) => (this.fabRef = ref)}
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
            right: -breakWidth * 2,
            bottom: 65,
            ...styles.actionOptionsContainer,
          }}
        >
          <AnimatableTouchable
            onPress={() => this.handleAction("CreateHabit")}
            useNativeDriver
            onLayout={({ nativeEvent }) =>
              this.setState({
                breakWidth: nativeEvent.layout.width,
                breakHeight: nativeEvent.layout.height,
              })
            }
            ref={(ref) => (this.createRef = ref)}
            style={{
              ...styles.actionOptionContainer,
              borderColor: Colors.good,
            }}
          >
            <MaterialCommunityIcons name="check" color="#fff" size={25} />
            <Text style={styles.actionText}>Custom Habit</Text>
          </AnimatableTouchable>
          <AnimatableTouchable
            onPress={() => this.handleAction("PresetHabit")}
            useNativeDriver
            onLayout={({ nativeEvent }) =>
              this.setState({
                createWidth: nativeEvent.layout.width,
                createHeight: nativeEvent.layout.height,
              })
            }
            ref={(ref) => (this.breakRef = ref)}
            style={{
              ...styles.actionOptionContainer,
              borderColor: Colors.bad,
            }}
          >
            <MaterialCommunityIcons name="close" color="#fff" size={25} />
            <Text style={styles.actionText}>Preset Habit</Text>
          </AnimatableTouchable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  progressCircleContainer: {
    height: Layout.height * 0.23,
    width: Layout.height * 0.23,
    borderRadius: 100,
    alignSelf: "center",
    margin: Layout.padding,
    backgroundColor: Colors.background,
  },
  progressPercentage: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 25,
    top: Layout.padding + (Layout.height * 0.14) / 2,
  },
  percentageText: {
    alignSelf: "center",
    fontSize: 30,
  },
  percentageLabel: {
    alignSelf: "center",
    fontSize: 15,
  },
  currentHabitsText: {
    fontFamily: "Roboto-Regular",
    alignSelf: "center",
    fontSize: 30,
    color: Colors.textPrimary,
    padding: Layout.padding,
  },
  floatingActionButtonContainer: {
    position: "absolute",
    bottom: 15,
    right: 15,
  },
  actionOptionsContainer: {
    position: "absolute",
  },
  actionOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    alignItems: "center",
    padding: 10,
    borderRadius: Layout.roundness,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 20,
    paddingLeft: 5,
    fontFamily: "Roboto-Regular",
    color: "#fff",
  },
});

export default HomeScreen;

const HABITS = [
  {
    name: "Gym",
    streak: 8,
  },
  {
    name: "Smoking",
    streak: 33,
  },
  {
    name: "Games",
    streak: 176,
  },
];
