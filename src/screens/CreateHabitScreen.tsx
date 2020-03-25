import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { TextField } from "react-native-material-textfield";
import { connect } from "react-redux";
import { Layout, Colors, getTimeString } from "../config";
import { Header, DateTimePickerModal } from "../components";
import { createAnimatableComponent, Text } from "react-native-animatable";
import * as firebase from "../firebase";
import { User, Habit, Reminder } from "../types";

const AnimatableTouchable = createAnimatableComponent(TouchableOpacity);

const REMINDERS: Array<Reminder> = [
  { name: "Sun", active: false },
  { name: "Mon", active: false },
  { name: "Tue", active: false },
  { name: "Wed", active: false },
  { name: "Thu", active: false },
  { name: "Fri", active: false },
  { name: "Sat", active: false }
];

export interface CreateHabitScreenProps {
  user: User;
}

export interface CreateHabitScreenState {
  title: string;
  accountable: string;
  reminders: Array<Reminder>;
  showPicker: Boolean;
  time: Date;
}

class CreateHabitScreen extends React.Component<
  CreateHabitScreenProps,
  CreateHabitScreenState
> {
  state = {
    title: "",
    accountable: "",
    reminders: REMINDERS,
    showPicker: false,
    time: new Date()
  };
  reminderRef = null;

  handleFocus() {}

  handleBlur() {}

  showModal() {
    const { time } = this.state;
    this.setState({ showPicker: true });
    this.reminderRef.setValue(getTimeString(time));
  }

  handleTimeChange(event: any, date: Date) {
    this.reminderRef.setValue(getTimeString(date));
    if (Platform.OS === "android") {
      this.setState({ showPicker: false });
    }
  }

  toggleReminder(day: Reminder, index: number) {
    const newReminders = this.state.reminders;
    newReminders[index].active = !day.active;

    this.setState({ reminders: newReminders });
  }

  // TODO: get user id and save actual habit info
  async createHabit() {
    // destructure
    const { reminders, title, time } = this.state;
    const uid = firebase.uid();

    // create time string
    const remindTime = `${time.getHours()}:${time.getMinutes()}`;

    // add times to reminders
    const newReminders = reminders;
    newReminders.map(reminder => (reminder.time = remindTime));

    // generate habit object
    const habit: Habit = {
      uid,
      type: "create",
      active: true,
      title,
      dateStart: new Date(),
      reminders: newReminders
    };

    try {
      // push habit to database
      await firebase.createHabit(habit);
    } catch (error) {
      console.warn(error);
    }
  }

  handlePickerSubmit() {
    setTimeout(
      () => this.setState({ showPicker: false }, () => console.log("hidden")),
      100
    );
  }

  render() {
    const { reminders, showPicker, time } = this.state;
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Create Your Own Habit</Text>
          <TextField
            label="Title"
            onChangeText={text => this.setState({ title: text })}
            tintColor={Colors.tertiary}
            baseColor={Colors.tertiary}
            lineWidth={2}
            textColor={Colors.textPrimary}
            onFocus={() => this.handleFocus()}
            onSubmitEditing={() => this.handleBlur()}
          />
          <Text style={styles.dayLabel}>Remind Me On</Text>
          <View style={styles.remindersContainer}>
            {reminders.map((day, index) => {
              const renderSeperator = index !== 6;
              return (
                <AnimatableTouchable
                  key={index}
                  useNativeDriver
                  activeOpacity={1}
                  style={{
                    ...styles.dayContainer,
                    borderTopStartRadius: index === 0 ? Layout.roundness : 0,
                    // borderBottomStartRadius: index === 0 ? Layout.roundness : 0,
                    borderTopEndRadius: index === 6 ? Layout.roundness : 0,
                    // borderBottomEndRadius: index === 6 ? Layout.roundness : 0,
                    backgroundColor: day.active ? Colors.secondary : "#fff",
                    transform: [{ scale: day.active ? 1.04 : 1 }],
                    zIndex: day.active ? 2 : 1
                  }}
                  onPress={() => this.toggleReminder(day, index)}
                >
                  <Text
                    useNativeDriver
                    style={{
                      color: day.active ? "#fff" : Colors.secondary,
                      transform: [{ scale: day.active ? 1.2 : 1 }],
                      fontFamily: "Roboto-Regular"
                    }}
                  >
                    {day.name}
                  </Text>
                </AnimatableTouchable>
              );
            })}
          </View>
          <TouchableOpacity onPress={() => this.showModal()}>
            <View pointerEvents={"none"}>
              <TextField
                ref={ref => (this.reminderRef = ref)}
                label="Reminder"
                onChangeText={text => this.setState({ title: text })}
                baseColor={Colors.tertiary}
                lineWidth={2}
                tintColor={Colors.tertiary}
                textColor={Colors.textPrimary}
              />
            </View>
          </TouchableOpacity>
          <TextField
            label="Add An Accountable"
            onChangeText={text => this.setState({ title: text })}
            tintColor={Colors.tertiary}
            baseColor={Colors.tertiary}
            lineWidth={2}
            textColor={Colors.textPrimary}
            onFocus={() => this.handleFocus()}
            onSubmitEditing={() => this.handleBlur()}
          />
        </View>
        {showPicker ? (
          <DateTimePickerModal
            display="default"
            value={time}
            onSubmit={() => this.handlePickerSubmit()}
            mode="time"
            onChange={(event, date) => this.handleTimeChange(event, date)}
          />
        ) : null}

        <TouchableOpacity onPress={() => this.createHabit()}>
          <Text>Create Habit</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    padding: Layout.padding
  },
  label: {
    fontSize: 30,
    alignSelf: "center",
    fontFamily: "Roboto-Regular",
    color: Colors.textPrimary
  },
  repeatText: {
    fontSize: 25,
    fontFamily: "Roboto-Regular",
    marginTop: Layout.padding * 2,
    color: Colors.textPrimary
  },
  remindersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Layout.padding,
    borderBottomWidth: 2,
    marginTop: Layout.padding * 0.9,
    borderBottomColor: Colors.tertiary
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: Layout.height * 0.07,
    backgroundColor: "#fff"
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    marginTop: Layout.padding * 3,
    color: Colors.tertiary
  }
});

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(CreateHabitScreen);
