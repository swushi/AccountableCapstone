import * as React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Header, ToggleButton } from "../components";
import * as Animatable from "react-native-animatable";

export interface MessagesScreenProps {}

export interface MessagesScreenState {}

class MessagesScreen extends React.Component<
  MessagesScreenProps,
  MessagesScreenState
> {
  containerRef: any;
  constructor(props: MessagesScreenProps) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header hideBack />
        <Animatable.View
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <View>
            <Text>MessagesScreen Component</Text>
          </View>
        </Animatable.View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});
export default MessagesScreen;
