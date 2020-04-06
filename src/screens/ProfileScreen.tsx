import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image
} from "react-native";
import { Layout, Colors, validateEmail } from "../config";
import { Header, ToggleButton } from "../components";
import * as Animatable from "react-native-animatable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { connect } from "react-redux";
import * as firebase from "../firebase";
import * as actions from "../redux/actions";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { User } from "../types";

export interface ProfileScreenProps {
  navigation: any;
  canNotify: Function;
  user: User;
 
}

export interface ProfileScreenState {
  notify: any;
  avatar:any;
}

class ProfileScreen extends React.Component<
  ProfileScreenProps,
  ProfileScreenState
> {
  containerRef: any;
  constructor(props: ProfileScreenProps) {
    super(props);
    this.state = {
      notify: true,
      avatar: null
    };
  }

  componentDidMount() {
    console.log(this.props);
    this.checkForAvatar()
  }

  checkForAvatar() {
    const { avatar } = this.props.user;
    if(avatar) {
      this.setState({avatar});
    }
  }

  signOutAsync = async () => {
    const signIn = await firebase.signOut();
    this.navToSignIn();
  };
  navToSignIn = () => {
    this.props.navigation.navigate("SignIn");
  };

  toggleHandle = value => {
    this.setState({ notify: value });
    // update redux value
    this.props.canNotify("test");
  
  };

 
  getCameraPermission = async()=>{
    let permissionResult= await Permissions.askAsync(Permissions.CAMERA_ROLL);

  if (Constants.platform.ios||Constants.platform.android)
    {
       if (permissionResult.granted===false)
        {
          alert("We need permission to use your camera roll");
        }
    }        
      let result= await ImagePicker.launchImageLibraryAsync(
               {
                 
               mediaTypes:ImagePicker.MediaTypeOptions.Images,
               allowsEditing: true,
               aspect: [3,3]
        
               } )   

    if (result.cancelled===false){
       this.setState({avatar:result.uri});
       this.uploadImage(result.uri)
       .then(()=>{
        console.log(this.state.avatar);
       })
       .catch((error) =>{
        console.log(error)
       });
      }
   
 }   

  uploadImage= async (uri)=>{
    try {
      const response= await fetch (uri);
      const blob= await response.blob();
  
      await firebase.storeUserAvatarInStorage(blob);
      const url = await firebase.getAvatarURL();
      await firebase.storeUserAvatarInDB(url);
  
    } catch (error) {
      console.log('upload err', error)
    }
    
  }
  
  render() {
    const { notify } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Header hideBack />
        <Animatable.View
          style={styles.container}
          ref={ref => (this.containerRef = ref)}
          useNativeDriver
        >
          <View style={styles.inputContainer}>

          <TouchableOpacity onPress={this.getCameraPermission}> 
          <Image
                   
          source= {this.state.avatar ? {uri:(this.state.avatar) }: require('../assets/tempAvatar.png')}
          style={styles.profileCircle}

          />
        </TouchableOpacity>

           
            <Text style={styles.userText}> User </Text>

                
            <TouchableOpacity onPress={() => this.toggleHandle(!notify)}>
              <View style={styles.notifyContainer} pointerEvents="none">
                <ToggleButton isOn={notify} />
                <Text style={styles.notifyText}> Notifications </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.signOutAsync()}>
              <View style={styles.signOutContainer}>
                <MaterialCommunityIcons
                  style={styles.exitSign}
                  name="exit-to-app"
                  size={30}
                />
                <Text style={styles.signOutText}> Sign Out </Text>
              </View>
            </TouchableOpacity>
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
  inputContainer: {
    paddingHorizontal: Layout.padding,
    backgroundColor: "#fff",
    borderRadius: Layout.roundness,
    marginTop: 20
  },
  profileCircle: {
    height: Layout.height * 0.23,
    width: Layout.height * 0.23,
    borderRadius: 100,
    alignSelf: "center",
    margin: Layout.padding,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginBottom: 40
  },
  userText: {
    fontSize: 40,
    fontFamily: "Roboto-Regular",
    alignSelf: "center",
    color: Colors.textPrimary,
    marginBottom: 20
  },
  notifyContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: Layout.roundness,
    backgroundColor: "#fff",
    marginTop: 20,
    marginBottom: 20
  },
  notifyText: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    alignSelf: "flex-start",
    color: Colors.textPrimary,
    padding: Layout.padding
  },
  signOutContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: Layout.roundness,
    backgroundColor: "#fff",
    marginBottom: 5
  },
  signOutText: {
    fontSize: 20,
    fontFamily: "Roboto-Regular",
    alignSelf: "flex-start",
    color: Colors.textPrimary,
    padding: Layout.padding
  },
  exitSign: {
    alignItems: "center",
    alignSelf: "flex-end",
    marginRight: 30,
    marginBottom: -30
  }
});

const mapStateToProps = state => ({ user: state.user, notify: state.notify });

export default connect(mapStateToProps, actions)(ProfileScreen);
