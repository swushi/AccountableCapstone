import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import DelayInput from "react-native-debounce-input";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Header, SearchItem } from "../components";
import * as firebase from "../firebase";
import { User, UserID } from "../types";
import { Layout, Colors } from "../config";

export interface MessagesScreenProps {}

export interface MessagesScreenState {
  searchResults: User[];
  data: User[];
  value: string;
  loading: boolean;
  searching: boolean;
  error: any;
}

class MessagesScreen extends React.Component<
  MessagesScreenProps,
  MessagesScreenState
> {
  constructor(props: MessagesScreenProps) {
    super(props);
    this.state = {
      loading: false,
      value: "",
      data: [],
      error: null,
      searching: false,
      searchResults: [],
    };
  }

  componentDidMount() {
    this.fetchAllUsers();
  }

  async fetchAllUsers() {
    let dataArray = [];
    try {
      const allUsers = await firebase.getAllUsers();
      allUsers.forEach((doc) => {
        dataArray.push(doc.data());
      });

      this.setState({ data: dataArray });
    } catch (err) {
      console.log(err);
    }
  }

  searchFilterFunction = async (text: string) => {
    text = text.trim();
    const words = [];
    text.split(" ").forEach((word) => {
      words.push(word.charAt(0).toUpperCase() + word.slice(1));
    });

    text = words.join(" ");

    this.setState({
      value: text,
      searching: true,
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
            "firstName"
          );
          firstNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
          const lastNameResults = await firebase.searchUsers(text, "lastName");
          lastNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
        } else if (text.split(" ").length == 2) {
          const fullNameResults = await firebase.searchUsers(text, "fullName");
          fullNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
        }
      } else if (text === "") {
        this.setState({ searching: false });
      }
      this.setState({ searchResults: tempSearchResults });
    } catch (error) {
      console.log("serach err", error);
    }
  };

  renderHeader = () => {
    const { value } = this.state;
    return (
      <View style={styles.inputContainer}>
        <DelayInput
          delayTimeout={300}
          style={{ flex: 1, fontSize: 17 }}
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
    );
  };

  async addFriend(followID: UserID) {
    try {
      await firebase.follow(followID);
      await firebase.addFollower(followID);
    } catch (error) {
      console.log("follow err", error);
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Header hideBack />
        <FlatList
          style={{ paddingHorizontal: Layout.padding }}
          data={
            this.state.searching ? this.state.searchResults : this.state.data
          }
          renderItem={({ item }) => (
            <SearchItem user={item} onPress={() => this.addFriend(item.uid)} />
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
  },
  inputContainer: {
    paddingVertical: Layout.padding / 2,
    paddingHorizontal: Layout.padding,
    marginTop: Layout.padding,
    marginBottom: 0,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
export default MessagesScreen;
