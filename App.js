import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from 'firebase/firestore';

// Import screens
import Start from './components/Start';
import Chat from './components/Chat';

// Import React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { LogBox, Alert } from 'react-native';
import { getStorage } from 'firebase/storage';

// Ignore specific logs for better development experience
LogBox.ignoreLogs(['AsyncStorage has been extracted from']);

// Create the navigator
const Stack = createNativeStackNavigator();


//web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDKyB6Z5tK4hZP7htwQzR3EnqS05v4I55M',
  authDomain: 'chat-app-d0843.firebaseapp.com',
  projectId: 'chat-app-d0843',
  storageBucket: 'chat-app-d0843.appspot.com',
  messagingSenderId: '1035075461116',
  appId: '1:1035075461116:web:15372f5e7b23de9e4e1c79',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * Main application component responsible for rendering screens and handling Firebase setup.
 *
 * @returns {JSX.Element} - The JSX element representing the main application component.
 */
const App = () => {
  // Get the network connection status
  const connectionStatus = useNetInfo();

  // Checking status (for development purposes)
  console.log('Connection Status:', connectionStatus.isConnected);

  // Handle online/offline status and disable/enable Firestore network accordingly
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost');
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        {/* Screen for Start component */}
        <Stack.Screen name="Start" component={Start} />

        {/* Screen for Chat component */}
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;