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
    this.fabRef.transitionTo(
      {
        rotate: "45deg"
      },
      500
    );
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
    const { habits, breakWidth } = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Header hideBack />
        <View style={styles.contentContainer} pointerEvents="none">
          <View style={styles.progressCircleContainer}></View>
          <Text style={styles.currentHabitsText}>Current Habits</Text>
          <FlatList
            data={habits}
            keyExtractor={item => item.name}
            renderItem={({ item }) => <HabitButton data={item} />}
          />
        </View>
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
