import React, { Component } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Colors, Layout } from "../config";
import { TextField } from "react-native-material-textfield";
import { createAnimatableComponent, Text } from "react-native-animatable";
import { Notifications } from "expo";
import * as firebase from "../firebase";
import { getTimeString, getRemindTime } from "../config";
import { Header, DateTimePickerModal } from "../components";
import { Reminder, ExpoLocalNotification, Habit } from "../types";

const AnimatableTouchable = createAnimatableComponent(TouchableOpacity);

interface Props {
  navigation: any;
  route: any;
}

interface State {
  title: string;
  reminders: Array<Reminder>;
  habitType: String;
  chosenTime: Date | null;
  showPicker: boolean;
}

class EditHabitScreen extends Component<Props, State> {
  state = {
    title: "",
    habitType: "Create",
    reminders: REMINDERS,
    chosenTime: new Date(),
    showPicker: false,
  };
  titleRef = null;
  reminderRef = null;
  accountableRef = null;

  componentDidMount() {
    this.preFillEditForm();
  }

  preFillEditForm() {
    const { title, type, reminders, accountable } = this.props.route.params;
    this.titleRef.setValue(title);
    this.reminderRef.setValue(reminders[0].time);
    if (accountable) {
      this.accountableRef.setValue(accountable.fullName);
    }

    this.setState({
      title,
      habitType: type,
      reminders,
    });
  }

  toggleReminder(day: Reminder, index: number) {
    const newReminders = this.state.reminders;
    newReminders[index].active = !day.active;

    this.setState({ reminders: newReminders });
  }

  showModal() {
    const { chosenTime } = this.state;
    this.setState({ showPicker: true });
    this.reminderRef.setValue(getTimeString(chosenTime));
  }

  handlePickerSubmit() {
    setTimeout(() => this.setState({ showPicker: false }, () => null), 100);
  }

  handleTimeChange(event: any, date: Date) {
    if (Platform.OS === "android") {
      this.setState({ showPicker: false });
    }
    this.reminderRef.setValue(getTimeString(date));
    this.setState({ chosenTime: date });
  }

  async saveEdit() {
    const { navigation } = this.props;
    const { title, habitType, reminders, chosenTime } = this.state;
    const { accountable, habitId, notes, dateStart } = this.props.route.params;

    const uid = firebase.uid();

    try {
      this.props.route.params.reminders.forEach((oldReminder, index) => {
        if (oldReminder.localId) {
          console.log("getting rid of", oldReminder.day);
          Notifications.dismissNotificationAsync(oldReminder.localId);
          delete reminders[index].localId;
        }
      });

      const remindTime = getTimeString(chosenTime);

      // add times to reminders
      const newReminders = reminders;
      newReminders.map((reminder) => (reminder.time = remindTime));

      //add completed to reminders
      newReminders.map((reminder) => (reminder.completed = false));

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

      console.table(newReminders);

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

      //await Notifications.cancelAllScheduledNotificationsAsync(); // dont actually send notifications

      // generate habit object
      const habit: Habit = {
        uid,
        // @ts-ignore
        type: habitType,
        active: true,
        title,
        dateStart,
        reminders: newReminders,
        notes,
        accountable,
      };

      firebase.updateHabit(habitId, habit);
      navigation.popToTop();
    } catch (err) {
      console.log("ERROR", err);
      firebase.logError({
        screen: "EditHabitScreen",
        function: "saveEdit()",
        error: err,
      });
    }
  }

  getAccountable() {
    const { navigate } = this.props.navigation;
    navigate("SelectAccountable");
  }

  render() {
    const { habitType, reminders, showPicker, chosenTime } = this.state;
    const { accountable } = this.props.route.params;
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Edit Your Habit</Text>
          <TextField
            ref={(ref) => (this.titleRef = ref)}
            label="Title"
            onChangeText={(text) => this.setState({ title: text })}
            tintColor={Colors.secondary}
            baseColor={Colors.secondary}
            lineWidth={1}
            textColor={Colors.textPrimary}
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
                baseColor={Colors.secondary}
                lineWidth={1}
                tintColor={Colors.secondary}
                textColor={Colors.textPrimary}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.getAccountable()}>
            <View pointerEvents={"none"}>
              <TextField
                ref={(ref) => (this.accountableRef = ref)}
                label="Add An Accountable (Optional)"
                tintColor={Colors.secondary}
                baseColor={Colors.secondary}
                lineWidth={1}
                textColor={Colors.textPrimary}
              />
            </View>
          </TouchableOpacity>
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
          onPress={() => this.saveEdit()}
          style={styles.saveEditButton}
        >
          <Text style={styles.buttonText}>Save Edits</Text>
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
  remindersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: Layout.padding,
    borderRadius: Layout.roundness,
    borderWidth: 1,
    marginTop: Layout.padding * 0.9,
    borderColor: Colors.secondary,
  },
  saveEditButton: {
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

const REMINDERS: Array<Reminder> = [
  { day: "Sun", active: false, completed: false },
  { day: "Mon", active: false, completed: false },
  { day: "Tue", active: false, completed: false },
  { day: "Wed", active: false, completed: false },
  { day: "Thu", active: false, completed: false },
  { day: "Fri", active: false, completed: false },
  { day: "Sat", active: false, completed: false },
];

export default EditHabitScreen;
