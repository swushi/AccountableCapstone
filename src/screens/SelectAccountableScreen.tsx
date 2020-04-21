import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DelayInput from "react-native-debounce-input";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { User } from "../types";
import { Header, SearchItem } from "../components";
import { Colors, Layout } from "../config";
import * as firebase from "../firebase";

interface Props {
  navigation: any;
  storeAccountable: Function;
}

interface State {
  value: string;
  following: User[];
  loading: Boolean;
}

class SelectAccountableScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      following: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.fetchFollowing();
  }

  async fetchFollowing() {
    this.setState({ loading: true });
    const followingArray = [];
    try {
      const following = await firebase.getFollowing();

      this.setState({
        following,
        loading: false,
      });
    } catch (err) {
      firebase.logError({
        screen: "Select Accountable Screen",
        function: "fetchFollowing()",
        error: err,
      });    }
  }

  searchFilterFunction = async (text: string) => {
    const { following } = this.state;

    following.filter((user) => {
      const userData = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`;
      const textData = text.toUpperCase();
      return userData.indexOf(textData) > -1;
    });
  };

  handleSelect(user: User) {
    const { navigation, storeAccountable } = this.props;

    // set selected accountable in redux
    storeAccountable(user);

    // navigate back to screen
    navigation.goBack();
  }

  renderHeader = () => {
    const { value, following } = this.state;
    return (
      <View>
        <View style={styles.inputContainer}>
          <DelayInput
            delayTimeout={300}
            style={{ flex: 1, fontSize: 17, marginLeft: Layout.padding }}
            placeholder="Search..."
            onChangeText={(text: string) => this.searchFilterFunction(text)}
            autoCorrect={false}
            value={this.state.value}
          />

          <MaterialCommunityIcons
            name={value.length >= 1 ? "close" : "magnify"}
            size={20}
            color={Colors.primary}
          />
        </View>
      </View>
    );
  };

  render() {
    const { following } = this.state;
    return (
      <View style={styles.container}>
        <Header />

        <FlatList
          style={{ paddingHorizontal: Layout.padding }}
          data={following}
          renderItem={({ item }) => (
            <SearchItem
              user={item}
              onPress={() => this.handleSelect(item)}
              selecting
            />
          )}
          ListHeaderComponent={this.renderHeader}
          keyExtractor={(item) => item.uid}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inputContainer: {
    paddingVertical: Layout.padding / 2,
    paddingHorizontal: Layout.padding,
    marginTop: Layout.padding,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.roundness,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default connect(null, actions)(SelectAccountableScreen);
