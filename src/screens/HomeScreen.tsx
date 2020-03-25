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
const AnimatableTouchable = Animatable.createAnimatableComponent(
  TouchableOpacity
);

export interface HomeScreenProps {
  navigation: any;
}

class HomeScreen extends React.Component<HomeScreenProps, any> {
  state = {
    habits: HABITS,
    createWidth: 0,
    breakWidth: 100,
    createHeight: 0,
    breakHeight: 0,
    animated: false
  };
  contentRef = null;
  createRef = null;
  breakRef = null;
  fabRef = null; // floating action button

  handleAction(screen: "CreateHabit" | "BreakHabit") {
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
        rotate: "45deg"
      },
      500
    );
    this.createRef.transitionTo({
      transform: [{ translateX: -createWidth * 2.2 }]
    });
    setTimeout(
      () =>
        this.breakRef.transitionTo({
          transform: [{ translateX: -breakWidth * 2.2 }]
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
        rotate: "0deg"
      },
      500
    );
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
    const { habits, breakWidth, animated } = this.state;
    return (
      <View style={styles.container}>
        <Animatable.View
          ref={ref => (this.contentRef = ref)}
          style={{ ...styles.contentContainer }}
          pointerEvents={animated ? "none" : "auto"}
        >
          <Header hideBack />
          <View style={styles.progressCircleContainer}></View>
          <Text style={styles.currentHabitsText}>Current Habits</Text>
          <FlatList
            data={habits}
            keyExtractor={item => item.name}
            renderItem={({ item }) => <HabitButton data={item} />}
          />
        </Animatable.View>
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
            right: -breakWidth * 2,
            bottom: 65,
            ...styles.actionOptionsContainer
          }}
        >
          <AnimatableTouchable
            onPress={() => this.handleAction("CreateHabit")}
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
            <MaterialCommunityIcons name="check" color="#fff" size={25} />
            <Text style={styles.actionText}>Create Habit</Text>
          </AnimatableTouchable>
          <AnimatableTouchable
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
            <MaterialCommunityIcons name="delete" color="#fff" size={25} />
            <Text style={styles.actionText}>Break Habit</Text>
          </AnimatableTouchable>
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
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.primary,
    alignItems: "center",
    padding: 10,
    borderRadius: Layout.roundness,
    marginBottom: 5
  },
  actionText: {
    fontSize: 20,
    paddingLeft: 5,
    fontFamily: "Roboto-Regular",
    color: "#fff"
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
