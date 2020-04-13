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

export interface MessagesScreenProps {
  navigation: any;
}

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
    try {
      const allUsers = await firebase.getAllUsers();

      const followers = await firebase.getFollowers();

      const following = await firebase.getFollowing();

      this.setState(
        {
          allUsers,
          followers,
          following,
        },
        () => this.setState({ loading: false })
      );
    } catch (err) {
      console.log(err);
    }
  }

  searchFilterFunction = async (text: string) => {
    this.setState({ searching: text.length < 3 ? false : true });
    const { filter, allUsers, following, followers } = this.state;

    let newData: User[];

    if (filter == "discover") {
      newData = allUsers.filter((user) => {
        const userData = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`;
        const textData = text.toUpperCase();
        return userData.indexOf(textData) > -1;
      });
    } else if (filter == "followers") {
      newData = followers.filter((user) => {
        const userData = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`;
        const textData = text.toUpperCase();
        return userData.indexOf(textData) > -1;
      });
    } else if (filter == "following") {
      newData = following.filter((user) => {
        const userData = `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`;
        const textData = text.toUpperCase();
        return userData.indexOf(textData) > -1;
      });
    }

    this.setState({ searchResults: newData });
  };

  renderHeader = () => {
    const { value, filter, following, followers } = this.state;
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
            <View style={styles.countContainer}>
              <Text style={styles.count}>{following.length}</Text>
            </View>
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
            <View style={styles.countContainer}>
              <Text style={styles.count}>{followers.length}</Text>
            </View>
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

  handleSearchItemIconPress(user: User) {
    const { filter } = this.state;
    const { navigation } = this.props;

    // follow or chat with user
    if (filter !== "following") {
      this.addFriendAsync(user);
    } else {
      // navigate to chat screen
      navigation.navigate("Chat", { user });
    }
  }

  async addFriendAsync(userToFollow: User) {
    this.setState({ following: [...this.state.following, userToFollow] });
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
            <SearchItem
              user={item}
              onPress={() => this.handleSearchItemIconPress(item)}
              isFollowing={filter === "following" ? true : false}
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
    flexDirection: "row",
    alignItems: "center",
    ...Colors.shadow,
  },
  filterText: {
    color: Colors.textPrimary,
    fontFamily: "Roboto-Regular",
    fontSize: 16,
  },
  countContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 16,
    width: 16,
    borderRadius: 100,
    backgroundColor: "lightgrey",
    marginLeft: 5,
  },
  count: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: "Roboto-Regular",
  },
});
export default MessagesScreen;
