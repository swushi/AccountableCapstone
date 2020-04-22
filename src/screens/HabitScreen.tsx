import React, { Component } from "react";
import ProgressBar from "react-native-progress/Bar";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
  TouchableWithoutFeedback,
  Modal,
  ScrollView,
  FlatList,
} from "react-native";
import { BarChart, YAxis, XAxis, Grid } from "react-native-svg-charts";
import { Header } from "../components";
import { ProgressCircle } from "react-native-svg-charts";
import { Layout, Colors } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "react-native-material-textfield";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { updateHabit } from "../firebase";

interface Props {
  navigation: any;
  route: any;
}

interface State {}

class HabitScreen extends Component<Props, State> {
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  tempDate = new Date();

  tempData = [
    {
      id: "2",
      note: "Today was so much better i lifted triple my previous set",
      timeStamp: "Mon Apr 13 2020",
    },
    {
      id: "1",
      note: "Today was rough but i'm getting better",
      timeStamp: "Sun Apr 12 2020",
    },
  ];
  willFocusSubscription: any;
  constructor(props) {
    super(props);
    this.renderHabitLog = this.renderHabitLog.bind(this);
    this.renderStats = this.renderStats.bind(this);
    this.renderTabBar = this.renderTabBar.bind(this);
  }

  state = {
    chartData: [],
    showCompletionPrompt: true,
    showHelpModal: false,
    showNotePrompt: false,
    habitLog: [],
    notesValue: "",
    streak: 0,
    index: 0,
    routes: [
      {
        key: "habitLog",
        title: "Log",
      },
      { key: "habitStats", title: "Stats" },
    ],
  };

  componentWillUnmount() {
    this.willFocusSubscription();
  }
  async componentDidMount() {
    this.willFocusSubscription = this.props.navigation.addListener(
      "focus",
      async () => {
        this.forceUpdate();
        await this.buildChartData();
      }
    );

    await this.buildChartData();
    this.buildStats();
    this.loadHabitNotes();
    this.shouldShowCompletionPrompt();
  }

  buildStats() {
    const { streak } = this.props.route.params;

    this.setState({ streak });
  }

  buildChartData() {
    const { reminders } = this.props.route.params;

    const chartData = [];

    reminders.forEach((reminder) => {
      if (reminder.active) {
        if (reminder.completed) {
          chartData.push({
            ...reminder,
            value: 1,
            label: reminder.day,
            svg: { fill: "green", stroke: "green" },
          });
        } else {
          chartData.push({
            ...reminder,
            value: 0.1,
            label: reminder.day,
            svg: { fill: "red", stroke: "red" },
          });
        }
      } else {
        chartData.push({
          ...reminder,
          value: 0.1,
          label: reminder.day,
          svg: { fill: "grey", stroke: "grey" },
        });
      }
    });

    return new Promise((resolve) => {
      this.setState({ chartData }, () => resolve());
    });
  }

  getCurrentDayString() {
    let today = new Date();
    let currentDay = this.days[today.getDay()];
    return currentDay;
  }

  getCurrentDayIndex() {
    let today = new Date();
    return today.getDay();
  }

  shouldShowCompletionPrompt() {
    const currentDay = this.getCurrentDayIndex();
    if (
      this.state.chartData[currentDay].completed ||
      !this.state.chartData[currentDay].active
    ) {
      this.setState({ showCompletionPrompt: false });
    }
  }

  completeTask() {
    const { chartData } = this.state;
    const { habitId, reminders, streak, stats } = this.props.route.params;

    let newStreak = streak;
    newStreak++;

    const currentDay = this.getCurrentDayIndex();
    let newChartData = this.state.chartData;
    if (newChartData[currentDay].active) {
      reminders[currentDay].completed = true;
      newChartData[currentDay].value = 1;
      newChartData[currentDay].svg.fill = "green";
      newChartData[currentDay].svg.stroke = "green";
      stats.timesHit++;
      this.setState(
        {
          chartData: newChartData,
          showCompletionPrompt: false,
          showNotePrompt: true,
          streak: newStreak,
        },
        () => {
          updateHabit(habitId, { reminders, streak: newStreak, stats });
        }
      );
    }
  }

  loadHabitNotes() {
    const { notes } = this.props.route.params;
    this.setState({ habitLog: notes });
  }

  navigateToEdit() {
    const { navigate } = this.props.navigation;
    navigate("EditHabit", this.props.route.params);
  }

  render() {
    const { title } = this.props.route.params;
    const { navigate } = this.props.navigation;
    const { streak, index, routes } = this.state;
    const contentInset = { top: 10, bottom: 10 };
    return (
      <View style={styles.container}>
        <Header
          chatHeader={title}
          rightIcon="pencil"
          rightOnPress={() => this.navigateToEdit()}
        />
        <View style={styles.chartContainer}>
          <TouchableOpacity
            style={{ position: "absolute", right: 15, top: 15, zIndex: 5 }}
            onPress={() =>
              this.setState({ showHelpModal: !this.state.showHelpModal })
            }
          >
            <MaterialCommunityIcons
              size={22}
              name="information-outline"
              color={Colors.primary}
            />
          </TouchableOpacity>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.state.showHelpModal}
            onRequestClose={() => {
              console.log("Modal has been closed.");
            }}
          >
            <TouchableOpacity
              style={{ height: Layout.height }}
              activeOpacity={1}
              onPressOut={() => {
                this.setState({ showHelpModal: false });
              }}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: "green" }}>Green = Complete</Text>
                    <Text style={{ color: "red" }}>Red = Incomplete</Text>
                    <Text style={{ color: "grey" }}>Grey = Not Active</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => {
                      this.setState({ showHelpModal: false });
                    }}
                  >
                    <Text style={{ color: Colors.primary }}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>
          <View style={styles.chartTitleContainer}>
            <Text style={styles.chartTitle}>This Week's Completion</Text>
          </View>
          <View style={{ flex: 1 }}>
            <BarChart
              style={styles.chart}
              data={this.state.chartData}
              yAccessor={({ item }) => item.value}
              contentInset={contentInset}
              spacingInner={0}
              svg={{
                fillOpacity: "0.15",
                strokeDasharray: "18.9%, 150%",
              }}
            ></BarChart>
            <XAxis
              style={{ marginTop: 5, marginHorizontal: 13 }}
              data={this.state.chartData}
              contentInset={{ left: 10, right: 10 }}
              formatLabel={(value, index) => this.state.chartData[index].label}
              svg={{ fontSize: 12, fill: "grey" }}
            />
          </View>
        </View>
        {this.state.showCompletionPrompt && (
          <View style={styles.completedContainer}>
            <Text>Has This Been Completed Today?</Text>
            <TouchableOpacity
              style={styles.completedButton}
              onPress={() => this.completeTask()}
            >
              <Text style={{ color: "green" }}>Yes</Text>
              <MaterialCommunityIcons name="check" color="green" />
            </TouchableOpacity>
          </View>
        )}
        {this.state.showNotePrompt && (
          <View style={styles.notePromptContainer}>
            <Text>Would you like to add to your log?</Text>
            <TouchableOpacity
              style={styles.completedButton}
              onPress={() => {
                navigate("AddToLog", this.props.route.params);
                this.setState({
                  showNotePrompt: false,
                });
              }}
            >
              <Text style={{ color: "green" }}>Yes</Text>
              <MaterialCommunityIcons name="check" color="green" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => this.setState({ showNotePrompt: false })}
            >
              <Text style={{ color: "red" }}>No</Text>
              <MaterialCommunityIcons name="close" color="red" />
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.notesContainer}>
          <TabView
            navigationState={{ index, routes }}
            onIndexChange={(index) => this.setState({ index })}
            renderScene={({ route }) => {
              switch (route.key) {
                case "habitLog":
                  return this.renderHabitLog();
                case "habitStats":
                  return this.renderStats();
                default:
                  console.log(route.key);
                  return null;
              }
            }}
            renderTabBar={this.renderTabBar}
          />
        </View>
      </View>
    );
  }

  renderTabBar(props) {
    return (
      <TabBar
        {...props}
        indicatorStyle={{ backgroundColor: Colors.primary }}
        activeColor={Colors.primary}
        inactiveColor={Colors.textPrimary}
        style={{ backgroundColor: Colors.background }}
      />
    );
  }

  renderHabitLog() {
    return (
      <View style={{ padding: Layout.padding, flex: 1 }}>
        <View>
          {!!this.state.habitLog.length && (
            <FlatList
              data={this.state.habitLog}
              renderItem={({ item }) => {
                return (
                  <View style={styles.individualNote}>
                    <Text style={{color: 'grey', fontSize: 10}}>{item.time}</Text>
                    <Text>{item.note}</Text>
                  </View>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {this.state.habitLog.length === 0 && (
            <Text
              style={{
                alignSelf: "center",
                justifyContent: "center",
                color: "grey",
                marginHorizontal: 20,
              }}
            >
              Looks like your log is empty. Complete your habit on an active day
              to add a log.
            </Text>
          )}
        </View>
      </View>
    );
  }

  renderStats() {
    const { dateStart, stats, title } = this.props.route.params;
    const { streak } = this.state;
    const startDate = new Date(dateStart.seconds * 1000);
    let completion = (stats.timesHit + stats.timesBroken) === 0 ? 0 : stats.timesHit / (stats.timesHit + stats.timesBroken);
    let progress = streak / 66;
    let precision;

    if (completion < 0.1) {
      precision = 1;
    } else if (completion === 1) {
      precision = 3;
    } else {
      precision = 2;
    }

    return (
      <View style={{ padding: Layout.padding, flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 15 }}>Habit Created On:</Text>
          <Text>{startDate.toDateString()}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>Streak:</Text>
          <ProgressBar progress={progress} color={"red"} />
          <View style={styles.streakContainer}>
            <Text style={styles.streak}>{streak}</Text>
            <MaterialCommunityIcons name="fire" size={30} color={"red"} />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text>{title} Consistency: </Text>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ProgressCircle
              style={styles.progressCircleContainer}
              progress={completion} // TODO: get this from habit streaks
              startAngle={-Math.PI * 0.8}
              endAngle={Math.PI * 0.8}
              strokeWidth={5}
              progressColor={Colors.primary} // TODO: progress < 70% make orange, progress > 70% make green, progress < 50% make red
            />
            <View style={styles.progressPercentage}>
              <Text style={styles.percentageText}>
                {`${(completion * 100).toPrecision(precision)}%`}
              </Text>
            </View>
          </View>
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
  titleContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignSelf: "center",
    width: Layout.width * 0.9,
    justifyContent: "space-between",
  },
  habitTitle: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  streak: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
  },
  modalContainer: {
    padding: Layout.padding,
    backgroundColor: "#fff",
    height: Layout.height * 0.25,
    width: Layout.width * 0.4,
    top: Layout.height * 0.15,
    left: Layout.width * 0.46,
    alignItems: "center",
    ...Colors.shadow,
  },
  modalCloseButton: {
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.roundness,
  },
  chartContainer: {
    marginTop: 5,
    padding: 15,
    height: Layout.height * 0.25,
    width: Layout.width * 0.9,
    alignSelf: "center",
    backgroundColor: Colors.background,
    borderRadius: Layout.roundness,
    ...Colors.shadow,
  },
  chartTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  chartTitle: {
    alignSelf: "center",
  },
  chart: {
    flex: 1,
  },
  completedContainer: {
    height: Layout.height * 0.05,
    width: Layout.width * 0.9,
    paddingHorizontal: Layout.padding,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderRadius: Layout.roundness,
    ...Colors.shadow,
  },
  completedButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: Layout.roundness,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "red",
    borderRadius: Layout.roundness,
    paddingVertical: 1,
    paddingHorizontal: 5,
  },
  habitLogInputContainer: {
    width: Layout.width * 0.9,
    paddingHorizontal: Layout.padding,
    justifyContent: "space-between",
  },
  saveNoteButton: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: Layout.roundness,
    alignItems: "center",
  },
  notePromptContainer: {
    height: Layout.height * 0.05,
    width: Layout.width * 0.9,
    paddingHorizontal: Layout.padding,
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderRadius: Layout.roundness,
    ...Colors.shadow,
  },
  notesContainer: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    width: Layout.width * 0.9,
    alignSelf: "center",
    borderRadius: Layout.roundness,
    ...Colors.shadow,
  },
  individualNote: {
    padding: 5,
    margin: 7,
    backgroundColor: "#fff",
    borderRadius: Layout.roundness,
  },
  progressCircleContainer: {
    height: Layout.height * 0.1,
    width: Layout.height * 0.1,
    borderRadius: 100,
    margin: Layout.padding,
    backgroundColor: Colors.background,
  },
  progressPercentage: {
    position: "absolute",
    alignSelf: "center",
    fontSize: 15,
  },
  percentageText: {
    alignSelf: "center",
    fontSize: 15,
  },
});

export default HabitScreen;
