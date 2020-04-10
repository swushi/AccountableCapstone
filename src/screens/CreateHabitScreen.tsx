import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { TextField } from "react-native-material-textfield";
import { connect } from "react-redux";
import { Notifications } from "expo";
import { Layout, Colors, getTimeString, getRemindTime } from "../config";
import { Header, DateTimePickerModal } from "../components";
import { createAnimatableComponent, Text } from "react-native-animatable";
import * as firebase from "../firebase";
import { User, Habit, Reminder, ExpoLocalNotification } from "../types";

const AnimatableTouchable = createAnimatableComponent(TouchableOpacity);

const REMINDERS: Array<Reminder> = [
  { day: "Sun", active: false },
  { day: "Mon", active: false },
  { day: "Tue", active: false },
  { day: "Wed", active: false },
  { day: "Thu", active: false },
  { day: "Fri", active: false },
  { day: "Sat", active: false },
];

export interface CreateHabitScreenProps {
  user: User;
}

export interface CreateHabitScreenState {
  title: string;
  accountable: string;
  reminders: Array<Reminder>;
  showPicker: Boolean;
  chosenTime: Date | null;
  habitType: string;
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
    chosenTime: new Date(),
    habitType: "Create",
  };
  reminderRef = null;

  handleFocus() {}

  handleBlur() {}

  showModal() {
    const { chosenTime } = this.state;
    this.setState({ showPicker: true });
    this.reminderRef.setValue(getTimeString(chosenTime));
  }

  handleTimeChange(event: any, date: Date) {
    if (Platform.OS === "android") {
      this.setState({ showPicker: false });
    }
    this.reminderRef.setValue(getTimeString(date));
    this.setState({ chosenTime: date });
  }

  toggleReminder(day: Reminder, index: number) {
    const newReminders = this.state.reminders;
    newReminders[index].active = !day.active;

    this.setState({ reminders: newReminders });
  }

  // TODO: get user id and save actual habit info
  async createHabit() {
    // destructure
    const { reminders, title, chosenTime } = this.state;

    const uid = firebase.uid();

    // TODO: pass type param to screen through navigation
    const type = "Create";
    const isCreate = type === "Create";

    // create time string
    const remindTime = getTimeString(chosenTime);

    // add times to reminders
    const newReminders = reminders;
    newReminders.map((reminder) => (reminder.time = remindTime));

    // create local notifications
    const notificationTitle = `Did you finish ${title} today?`;
    const notificationBody = `Go into the app and continue your streak!`;
    const localNotifications: ExpoLocalNotification[] = [];
    newReminders.map((reminder, index) => {
      if (reminder.active) {
        const remindTime = getRemindTime(chosenTime, reminder.day);

        const localNotification: ExpoLocalNotification = {
          notification: {
            title: notificationTitle,
            body: notificationBody,
          },
          repeat: {
            time: remindTime,
            repeat: "week",
          },
        };

        localNotifications.push(localNotification);
      }
    });

    let notificationIds = [];

    localNotifications.forEach(({ notification, repeat }) => {
      const prom = Notifications.scheduleLocalNotificationAsync(
        notification,
        repeat
      );
      notificationIds.push(prom);
    });

    // get ids
    notificationIds = await Promise.all(notificationIds);

    // store ids in reminder array
    let idIter = 0;
    newReminders.forEach((reminder) => {
      if (reminder.active) {
        reminder.localId = notificationIds[idIter];
        idIter++;
      }
    });

    await Notifications.cancelAllScheduledNotificationsAsync(); // dont actually send notifications

    // generate habit object
    const habit: Habit = {
      uid,
      type,
      active: true,
      title,
      dateStart: new Date(),
      reminders: newReminders,
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
    const { reminders, showPicker, chosenTime, habitType } = this.state;
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Setup Your Habit</Text>
          <TextField
            label="Title"
            onChangeText={(text) => this.setState({ title: text })}
            tintColor={Colors.secondary}
            baseColor={Colors.secondary}
            lineWidth={1}
            textColor={Colors.textPrimary}
            onFocus={() => this.handleFocus()}
            onSubmitEditing={() => this.handleBlur()}
          />
          <Text style={styles.dayLabel}>Habit Type</Text>
          <View style={styles.createOrBreakContainer}>
            <AnimatableTouchable
              activeOpacity={0.9}
              onPress={() => this.setState({ habitType: "Create" })}
              style={{
                ...styles.createOrBreakButton,
                backgroundColor:
                  habitType === "Create" ? Colors.secondary : "transparent",
                transform: [{ scaleY: habitType === "Create" ? 1.02 : 1 }],
              }}
            >
              <Text
                style={{
                  color: habitType === "Create" ? "#fff" : Colors.secondary,
                  transform: [{ scale: habitType === "Create" ? 1.2 : 1 }],
                  fontFamily: "Roboto-Regular",
                }}
              >
                Create
              </Text>
            </AnimatableTouchable>
            <AnimatableTouchable
              activeOpacity={0.9}
              onPress={() => this.setState({ habitType: "Break" })}
              style={{
                ...styles.createOrBreakButton,
                backgroundColor:
                  habitType === "Break" ? Colors.secondary : "transparent",
                transform: [{ scaleY: habitType === "Break" ? 1.02 : 1 }],
              }}
            >
              <Text
                style={{
                  color: habitType === "Break" ? "#fff" : Colors.secondary,
                  transform: [{ scale: habitType === "Break" ? 1.2 : 1 }],
                  fontFamily: "Roboto-Regular",
                }}
              >
                Break
              </Text>
            </AnimatableTouchable>
          </View>
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
                    borderLeftColor: Colors.secondary,
                    borderLeftWidth: index !== 0 ? 1 : 0,
                    borderTopStartRadius: index === 0 ? Layout.roundness : 0,
                    borderBottomStartRadius: index === 0 ? Layout.roundness : 0,
                    borderBottomEndRadius: index === 6 ? Layout.roundness : 0,
                    borderTopEndRadius: index === 6 ? Layout.roundness : 0,
                    backgroundColor: day.active ? Colors.secondary : "#fff",
                    transform: [{ scale: day.active ? 1.04 : 1 }],
                    zIndex: day.active ? 2 : 1,
                  }}
                  onPress={() => this.toggleReminder(day, index)}
                >
                  <Text
                    useNativeDriver
                    style={{
                      color: day.active ? "#fff" : Colors.secondary,
                      transform: [{ scale: day.active ? 1.2 : 1 }],
                      fontFamily: "Roboto-Regular",
                    }}
                  >
                    {day.day}
                  </Text>
                </AnimatableTouchable>
              );
            })}
          </View>
          <TouchableOpacity onPress={() => this.showModal()}>
            <View pointerEvents={"none"}>
              <TextField
                ref={(ref) => (this.reminderRef = ref)}
                label="Time"
                onChangeText={(text) => this.setState({ title: text })}
                baseColor={Colors.secondary}
                lineWidth={1}
                tintColor={Colors.secondary}
                textColor={Colors.textPrimary}
              />
            </View>
          </TouchableOpacity>
          <TextField
            label="Add An Accountable (Optional)"
            tintColor={Colors.secondary}
            baseColor={Colors.secondary}
            lineWidth={1}
            textColor={Colors.textPrimary}
            onFocus={() => this.handleFocus()}
            onSubmitEditing={() => this.handleBlur()}
          />
        </View>
        {showPicker ? (
          <DateTimePickerModal
            display="default"
            value={chosenTime}
            onSubmit={() => this.handlePickerSubmit()}
            mode="time"
            onChange={(event, date) => this.handleTimeChange(event, date)}
          />
        ) : null}
        <TouchableOpacity
          onPress={() => this.createHabit()}
          style={styles.createHabitButton}
        >
          <Text style={styles.buttonText}>{`${habitType} habit`}</Text>
        </TouchableOpacity>
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
    padding: Layout.padding,
  },
  label: {
    fontSize: 30,
    alignSelf: "center",
    fontFamily: "Roboto-Regular",
    color: Colors.textPrimary,
  },
  repeatText: {
    fontSize: 25,
    fontFamily: "Roboto-Regular",
    marginTop: Layout.padding * 2,
    color: Colors.textPrimary,
  },
  remindersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Layout.padding,
    borderRadius: Layout.roundness,
    borderWidth: 1,
    marginTop: Layout.padding * 0.9,
    borderColor: Colors.secondary,
  },
  createOrBreakContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Layout.padding,
    borderWidth: 1,
    borderRadius: Layout.roundness,
    marginTop: Layout.padding * 0.9,
    borderColor: Colors.secondary,
    backgroundColor: "#fff",
  },
  createOrBreakButton: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: Layout.height * 0.07,
  },
  createOrBreakText: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    marginTop: Layout.padding * 3,
    color: Colors.secondary,
  },
  dayContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: Layout.height * 0.07,
    backgroundColor: "#fff",
  },
  dayLabel: {
    fontSize: 12,
    fontFamily: "Roboto-Regular",
    marginTop: Layout.padding * 3,
    color: Colors.secondary,
  },
  createHabitButton: {
    position: "absolute",
    top: Layout.height * 0.83,
    padding: Layout.padding,
    paddingHorizontal: Layout.padding * 2,
    borderColor: Colors.secondary,
    alignSelf: "center",
    borderRadius: Layout.roundness,
    borderWidth: 1,
    alignItems: "center",
    marginTop: Layout.padding,
  },
  buttonText: {
    color: Colors.secondary,
    fontSize: 20,
  },
});

const mapStateToProps = (state) => ({ user: state.user });

export default connect(mapStateToProps)(CreateHabitScreen);
