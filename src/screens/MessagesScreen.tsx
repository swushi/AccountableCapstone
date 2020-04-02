import * as React from "react";
import { View, StyleSheet, FlatList, Text, ActivityIndicator  } from "react-native";
import { Header, ToggleButton } from "../components";
import { SearchBar, ListItem } from "react-native-elements";
import * as firebase from "../firebase";
import * as Animatable from "react-native-animatable";

export interface MessagesScreenProps {

}

export interface MessagesScreenState {

}

class MessagesScreen extends React.Component<
  MessagesScreenProps,
  MessagesScreenState
> {
  containerRef: any;
  arrayholder: any[];
  constructor(props: MessagesScreenProps) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      error: null,
    };
    this.arrayholder = [];
  }
  componentDidMount() {
    this.displayAllUsers();
  }
  displayAllUsers = () => { 
    let itemsRef = firebase.getAllUsers();
    itemsRef.on('value', (snapshot) => {
      let data = snapshot.val();
      let item = Object.values(data);
      this.setState({item});
    });
   };
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
      />
    );
  };
  searchFilterFunction = text => {
    this.setState({
      value: text,
    });

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.name.title.toUpperCase()} ${item.name.first.toUpperCase()} ${item.name.last.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };
  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Search..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Header hideBack />
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
              leftAvatar={{ source: { uri: item.picture.thumbnail } }}
              title={`${item.name.first} ${item.name.last}`}
              subtitle={item.email}
            />
          )}
          keyExtractor={item => item.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
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
