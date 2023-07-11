//Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import screens
import Start from './components/Start';
import Chat from './components/Chat';


// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LogBox } from 'react-native';
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
  appId: "1:1035075461116:web:15372f5e7b23de9e4e1c79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

 // Initialize Cloud Firestore and get a reference to the service
 const db = getFirestore(app);

 //Chat components that render UI
const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => <Chat {...props} db={db} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
