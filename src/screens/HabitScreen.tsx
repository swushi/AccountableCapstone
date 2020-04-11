import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { BarChart, YAxis, XAxis, Grid } from "react-native-svg-charts";
import { Header } from "../components";
import { Layout, Colors } from "../config";

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
      { value: 1, label: "Sun" },
      { value: 0.1, label: "Mon", svg: {fill: 'red'} },
      { value: 1, label: "Tue" },
      { value: 1, label: "Wed" },
      { value: 0.1, label: "Thu", svg: {fill: 'red'} },
      { value: 1, label: "Fri" },
      { value: 1, label: "Sat" },
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
                fill: 'green',
                fillOpacity: "0.15",
                
              }}
            ></BarChart>
            <XAxis
              style={{ marginTop: 2, marginHorizontal: 13 }}
              data={data}
              contentInset={{ left: 10, right: 10 }}
              formatLabel={(value, index) => data[index].label}
              svg={{ fontSize: 12, fill: "grey" }}
            />
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
  chartContainer: {
    marginTop: 25,
    padding: 15,
    height: Layout.height * 0.25,
    width: Layout.width * 0.9,
    alignSelf: "center",
    backgroundColor: Colors.background,
    borderRadius: 3,
    ...Colors.shadow,
  },
  chartTitle: {
    alignSelf: "center",
  },
  chart: {
    flex: 1,
  },
});

export default HabitScreen;
