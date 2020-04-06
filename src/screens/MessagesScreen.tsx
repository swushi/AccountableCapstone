import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { Header, ToggleButton } from "../components";
import { SearchBar, ListItem } from "react-native-elements";
import { FilledTextField } from "react-native-material-textfield";
import * as firebase from "../firebase";
import * as Animatable from "react-native-animatable";
import { User } from "../types";

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

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

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
    return (
      <FilledTextField
        placeholder="Search..."
        lightTheme
        round
        onChangeText={(text) => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

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
          data={
            this.state.searching ? this.state.searchResults : this.state.data
          }
          renderItem={({ item }) => (
            <Text>{item.email}</Text>
            // <ListItem
            //   leftAvatar={{ source: { uri: item.picture.thumbnail } }}
            //   title={`${item.name.first} ${item.name.last}`}
            //   subtitle={item.email}
            // />
          )}
          keyExtractor={(item) => item.uid}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default MessagesScreen;
