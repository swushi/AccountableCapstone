import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  RecyclerViewBackedScrollView,
} from "react-native";
import { BarChart, YAxis, XAxis, Grid } from "react-native-svg-charts";
import { Header } from "../components";
import { Layout, Colors } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getHabits } from "../firebase";

interface Props {
  navigation: any;
  route: any;
}

interface State {}

class HabitScreen extends Component<Props, State> {
  days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  state = {
    chartData: [],
    showCompletionPrompt: true,
  };

  async componentDidMount() {
    await this.buildChartData();
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
    const currentDay = this.getCurrentDayIndex();
    let newChartData = this.state.chartData;
    if (newChartData[currentDay].active) {
      newChartData[currentDay].value = 1;
      newChartData[currentDay].svg.fill = "green";
      newChartData[currentDay].svg.stroke = "green";
      this.setState({
        chartData: newChartData,
        showCompletionPrompt: false,
      });
    }
  }

  // TODO: build chart data array for initial state

  // TODO: have the days know if its been completed for that week in firebase

  // TODO: Edit the habit

  // TODO: Delete the habit

  // TODO: Push completion to firebase
  render() {
    const contentInset = { top: 10, bottom: 10 };
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>This Week's Completion</Text>
          <View style={{ flex: 1 }}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="information-outline"
                color={Colors.primary}
              />
            </TouchableOpacity>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  chartContainer: {
    marginTop: 25,
    padding: 15,
    height: Layout.height * 0.25,
    width: Layout.width * 0.9,
    alignSelf: "center",
    backgroundColor: Colors.background,
    borderRadius: Layout.roundness,
    ...Colors.shadow,
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
});

export default HabitScreen;
