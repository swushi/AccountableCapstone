import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { BarChart, YAxis, XAxis, Grid } from "react-native-svg-charts";
import { Header } from "../components";
import { Layout, Colors } from "../config";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  navigation: any;
  route: any;
}

interface State {}

class HabitScreen extends Component<Props, State> {
  componentDidMount() {
    // all params passed in 'this.props.route.params'
    const { route } = this.props;
  }

  render() {
    const data = [
      { value: 1, label: "Sun", svg: { fill: "green", stroke: "green" } },
      { value: 1, label: "Mon", svg: { fill: "green", stroke: "green" } },
      { value: 0.1, label: "Tue", svg: { fill: "red", stroke: "red" } },
      { value: 0.1, label: "Wed", svg: { fill: "red", stroke: "red" } },
      { value: 0.1, label: "Thu", svg: { fill: "red", stroke: "red" } },
      { value: 0.1, label: "Fri", svg: { fill: "red", stroke: "red" } },
      { value: 0.1, label: "Sat", svg: { fill: "red", stroke: "red" } },
    ];
    const contentInset = { top: 10, bottom: 10 };
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>This Week's Completion</Text>
          <View style={{ flex: 1 }}>
            <BarChart
              style={styles.chart}
              data={data}
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
              data={data}
              contentInset={{ left: 10, right: 10 }}
              formatLabel={(value, index) => data[index].label}
              svg={{ fontSize: 12, fill: "grey" }}
            />
          </View>
        </View>
        <View style={styles.completedContainer}>
          <Text>Has This Been Completed Today?</Text>
          <TouchableOpacity style={styles.completedButton}>
            <Text style={{ color: "green" }}>Yes</Text>
            <MaterialCommunityIcons name="check" color="green" />
          </TouchableOpacity>
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
