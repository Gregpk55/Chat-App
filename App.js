//Firebase
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";


// import screens
import Start from "./components/Start";
import Chat from "./components/Chat";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { LogBox, Alert } from "react-native";
import { getStorage } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker'


LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

//web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKyB6Z5tK4hZP7htwQzR3EnqS05v4I55M",
  authDomain: "chat-app-d0843.firebaseapp.com",
  projectId: "chat-app-d0843",
  storageBucket: "chat-app-d0843.appspot.com",
  messagingSenderId: "1035075461116",
  appId: "1:1035075461116:web:15372f5e7b23de9e4e1c79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);

//Chat components that render UI + connection status
const App = () => {
  const connectionStatus = useNetInfo();
//checking status
  console.log("Connection Status:", connectionStatus.isConnected);
//online/offline
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  const renderCustomActions = (props) => {
    return <CustomActions { ...props} />;
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
