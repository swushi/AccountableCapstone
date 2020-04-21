import React, { Component } from "react";
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
import { Layout, Colors } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "react-native-material-textfield";
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

  state = {
    chartData: [],
    showCompletionPrompt: true,
    showHelpModal: false,
    showNotePrompt: false,
    showNotesInput: false,
    habitLog: [],
    notesValue: "",
  };

  async componentDidMount() {
    await this.buildChartData();
    this.loadHabitNotes();
    this.shouldShowCompletionPrompt();
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
    const { habitId, reminders } = this.props.route.params;

    const currentDay = this.getCurrentDayIndex();
    let newChartData = this.state.chartData;
    if (newChartData[currentDay].active) {
      reminders[currentDay].completed = true;
      newChartData[currentDay].value = 1;
      newChartData[currentDay].svg.fill = "green";
      newChartData[currentDay].svg.stroke = "green";
      this.setState(
        {
          chartData: newChartData,
          showCompletionPrompt: false,
          showNotePrompt: true,
        },
        () => {
          updateHabit(habitId, { reminders });
        }
      );
    }
  }

  loadHabitNotes() {
    const { notes } = this.props.route.params;
    this.setState({ habitLog: notes });
  }

  addHabitNote() {
    const { notes, habitId } = this.props.route.params;
    const date = new Date();
    const readableTime = date.toDateString();
    const note = {
      note: this.state.notesValue,
      time: readableTime,
    };
    let newNotes = notes;
    newNotes.unshift(note);
    try {
      this.setState({
        habitLog: newNotes,
        showNotesInput: false,
      });
      updateHabit(habitId, { notes: newNotes });
    } catch (err) {
      console.log(err);
    }
  }

  navigateToEdit() {
    const { navigate } = this.props.navigation;
    navigate("EditHabit", this.props.route.params);
  }

  render() {
    const { title } = this.props.route.params;
    const contentInset = { top: 10, bottom: 10 };
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.titleContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.habitTitle}>{title}</Text>
            <TouchableOpacity
              style={{ justifyContent: "center", marginLeft: 5 }}
              onPress={() => this.navigateToEdit()}
            >
              <MaterialCommunityIcons
                size={18}
                name="pencil"
                color={Colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.streakContainer}>
            <Text style={styles.streak}>{30}</Text>
            <MaterialCommunityIcons name="fire" size={30} color={"red"} />
          </View>
        </View>
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
                  <Text style={{ color: "green" }}>Green = Complete</Text>
                  <Text style={{ color: "red" }}>Red = Incomplete</Text>
                  <Text style={{ color: "grey" }}>Grey = Not Active</Text>

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
              onPress={() =>
                this.setState({
                  showNotesInput: true,
                  showNotePrompt: false,
                })
              }
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
          {!this.state.showNotesInput && (
            <View>
              <Text style={{ alignSelf: "center", fontSize: 20 }}>
                Habit Log
              </Text>
              {!!this.state.habitLog.length && (
                <FlatList
                  data={this.state.habitLog}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.individualNote}>
                        <Text>{item.time}</Text>
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
                  Looks like your log is empty. Complete your habit on an active
                  day to add a log.
                </Text>
              )}
            </View>
          )}
          {this.state.showNotesInput && (
            <View style={styles.habitLogInputContainer}>
              <TextField
                label="Enter Notes Here"
                onChangeText={(text) => this.setState({ notesValue: text })}
                tintColor={"grey"}
                baseColor={"grey"}
                multiline={true}
                lineWidth={1}
                textColor={Colors.textPrimary}
              />
              <TouchableOpacity
                style={styles.saveNoteButton}
                onPress={() => this.addHabitNote()}
              >
                <Text style={{ color: Colors.primary }}>Save Note</Text>
              </TouchableOpacity>
            </View>
          )}
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
    marginTop: 3,
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
});

export default HabitScreen;
