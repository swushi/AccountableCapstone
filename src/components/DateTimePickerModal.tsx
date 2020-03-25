import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";

import { Layout, Colors } from "../config";

export interface DateTimePickerModalProps {
  onSubmit: any;
}

class DateTimePickerModal extends PureComponent<DateTimePickerModalProps, any> {
  state = {
    modalHeight: 0
  };
  modal = null;

  slide = (direction: "up" | "down", submit: Boolean = true) => {
    const { modalHeight } = this.state;
    const dir = direction == "up" ? -1 : 1;

    this.modal.transitionTo(
      { transform: [{ translateY: modalHeight * dir }] },
      500
    );
    if (submit === true) setTimeout(() => this.props.onSubmit(), 500);
  };

  render() {
    if (Platform.OS === "ios") {
      return (
        <Animatable.View
          animation="fadeInUpBig"
          duration={500}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}
          useNativeDriver={true}
          ref={ref => (this.modal = ref)}
          onLayout={e =>
            this.setState({
              modalHeight: e.nativeEvent.layout.y
            })
          }
        >
          <View
            style={{
              height: Layout.height * 0.05,
              padding: Layout.padding,
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: Colors.primary
            }}
          >
            <TouchableOpacity onPress={() => this.slide("down")}>
              <Text style={{ color: "#fff" }}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker {...this.props} />
        </Animatable.View>
      );
    } else {
      return <DateTimePicker {...this.props} />;
    }
  }
}

export default DateTimePickerModal;
