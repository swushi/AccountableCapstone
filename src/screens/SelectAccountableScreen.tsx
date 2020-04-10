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
  searchResults: User[];
  loading: Boolean;
}

class SelectAccountableScreen extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      searchResults: [],
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
      following.forEach((user) => {
        followingArray.push(user.data());
      });

      this.setState({
        searchResults: followingArray,
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  searchFilterFunction = async (text: string) => {
    const { searchResults } = this.state;

    text = text.trim();
    const words = [];
    text.split(" ").forEach((word) => {
      words.push(word.charAt(0).toUpperCase() + word.slice(1));
    });

    text = words.join(" ");

    this.setState({
      value: text,
    });

    // if there is no space in the search
    //  search firstName and lastName
    //  push both values to array
    // else there is a space
    //  search fullName

    try {
      let tempSearchResults = [];
      if (text != "") {
        if (text.split(" ").length == 1) {
          const firstNameResults = await firebase.searchUsers(
            text,
            "firstName",
            "following"
          );
          firstNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
        } else if (text.split(" ").length == 2) {
          const fullNameResults = await firebase.searchUsers(
            text,
            "fullName",
            "following"
          );
          fullNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
        }
      }
      this.setState({ searchResults: tempSearchResults });
    } catch (error) {
      console.log("serach err", error);
    }
  };

  handleSelect(user: User) {
    const { navigation, storeAccountable } = this.props;
    // set selected accountable in redux

    storeAccountable(user);

    // navigate back to screen
    navigation.goBack();
  }

  renderHeader = () => {
    const { value, searchResults } = this.state;
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
    const { searchResults } = this.state;
    return (
      <View style={styles.container}>
        <Header hideBack />

        <FlatList
          style={{ paddingHorizontal: Layout.padding }}
          data={searchResults}
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
