import * as React from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
  TouchableOpacity,
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
  allUsers: User[];
  followers: User[];
  following: User[];
  value: string;
  loading: boolean;
  searching: boolean;
  error: any;
  filter: "following" | "followers" | "discover";
}

class MessagesScreen extends React.Component<
  MessagesScreenProps,
  MessagesScreenState
> {
  searchRef: any;
  constructor(props: MessagesScreenProps) {
    super(props);
    this.state = {
      loading: false,
      value: "",
      allUsers: [],
      followers: [],
      following: [],
      error: null,
      searching: false,
      searchResults: [],
      filter: "following",
    };
  }

  componentDidMount() {
    this.fetchAllUsers();
  }

  async fetchAllUsers() {
    this.setState({ loading: true });
    const followingArray = [];
    const followersArray = [];
    const usersArray = [];
    try {
      const allUsers = await firebase.getAllUsers();
      allUsers.forEach((user) => {
        usersArray.push(user.data());
      });

      const followers = await firebase.getFollowers();
      followers.forEach((user) => {
        followersArray.push(user.data());
      });

      const following = await firebase.getFollowing();
      following.forEach((user) => {
        followingArray.push(user.data());
      });

      this.setState({
        allUsers: usersArray,
        followers: followersArray,
        following: followingArray,
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  searchFilterFunction = async (text: string) => {
    const { filter, allUsers, following, followers } = this.state;

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
            "firstName",
            filter
          );
          firstNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
          const lastNameResults = await firebase.searchUsers(
            text,
            "lastName",
            filter
          );
          lastNameResults.forEach((doc) => {
            tempSearchResults.push(doc.data());
          });
        } else if (text.split(" ").length == 2) {
          const fullNameResults = await firebase.searchUsers(
            text,
            "fullName",
            filter
          );
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
    const { value, filter } = this.state;
    return (
      <View>
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            onPress={() => this.changeFilter("following")}
            style={{
              ...styles.filterContainer,
              backgroundColor:
                filter === "following" ? Colors.secondary : "#fff",
            }}
          >
            <Text
              style={{
                ...styles.filterText,
                color: filter === "following" ? "#fff" : Colors.textPrimary,
              }}
            >
              Following
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.changeFilter("followers")}
            style={{
              ...styles.filterContainer,
              backgroundColor:
                filter === "followers" ? Colors.secondary : "#fff",
            }}
          >
            <Text
              style={{
                ...styles.filterText,
                color: filter === "followers" ? "#fff" : Colors.textPrimary,
              }}
            >
              Followers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.changeFilter("discover")}
            style={{
              ...styles.filterContainer,
              backgroundColor:
                filter === "discover" ? Colors.secondary : "#fff",
            }}
          >
            <Text
              style={{
                ...styles.filterText,
                color: filter === "discover" ? "#fff" : Colors.textPrimary,
              }}
            >
              Discover
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <DelayInput
            ref={(ref) => (this.searchRef = ref)}
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

  async addFriend(userToFollow: User) {
    try {
      await firebase.follow(userToFollow.uid);
      await firebase.addFollower(userToFollow.uid);
    } catch (error) {
      console.log("follow err", error);
    }
  }

  changeFilter(filter: "following" | "followers" | "discover") {
    this.setState({ filter });
  }

  render() {
    const {
      loading,
      filter,
      searching,
      allUsers,
      following,
      followers,
      searchResults,
    } = this.state;
    let displayData = [];

    if (filter === "following") {
      displayData = following;
    } else if (filter === "followers") {
      displayData = followers;
    } else {
      displayData = allUsers;
    }

    if (loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Header hideBack />

        <FlatList
          style={{ paddingHorizontal: Layout.padding }}
          data={searching ? searchResults : displayData}
          renderItem={({ item }) => (
            <SearchItem user={item} onPress={() => this.addFriend(item)} />
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
  filtersContainer: {
    padding: Layout.padding,
    paddingBottom: 0,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  filterContainer: {
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingHorizontal: Layout.padding,
    paddingVertical: Layout.padding / 2,
    ...Colors.shadow,
  },
  filterText: {
    color: Colors.textPrimary,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
});
export default MessagesScreen;
