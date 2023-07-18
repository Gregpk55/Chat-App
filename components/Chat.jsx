import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import MapView from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

import CustomActions from './CustomActions';

/**
 * The Chat component displays a chat interface with messages and input functionality.
 *
 * @param {object} props - The component props.
 * @param {object} props.db - The Firebase Firestore instance.
 * @param {object} props.route - The React Navigation route object.
 * @param {object} props.navigation - The React Navigation navigation object.
 * @returns {JSX.Element} - The JSX element representing the Chat component.
 */
const Chat = ({ db, route, navigation, isConnected, storage }) => {
  const { name, userID, selectedColor } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Subscribe to messages when the component mounts or when the 'isConnected' status changes.
    if (isConnected) {
      navigation.setOptions({ title: name });
      subscribeToMessages();
    } else {
      getCachedMessages();
    }
  }, [isConnected]);

  /**
   * Retrieves cached messages from AsyncStorage and sets them in the state.
   */
  const getCachedMessages = async () => {
    try {
      const cachedMessages = await AsyncStorage.getItem('cachedMessages');
      if (cachedMessages) {
        const parsedMessages = JSON.parse(cachedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.log('Error loading cached messages:', error);
    }
  };

  /**
   * Subscribes to the 'messages' collection in Firebase Firestore and updates the state with new messages.
   * Caches the messages in AsyncStorage.
   * @returns {function} - Function to unsubscribe from the Firebase Firestore listener.
   */
  const subscribeToMessages = () => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        const { createdAt, ...serializableData } = data;

        return {
          _id: doc.id,
          text: data.text,
          createdAt: createdAt.toDate(),
          ...serializableData,
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });

      AsyncStorage.setItem('cachedMessages', JSON.stringify(newMessages))
        .then(() => {
          setMessages(newMessages);
        })
        .catch((error) => {
          console.log('Error caching messages:', error);
        });
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  };

  /**
   * Handles sending new messages.
   * @param {object[]} newMessages - An array of new messages to send.
   */
  const onSend = (newMessages) => {
    if (isConnected) {
      addDoc(collection(db, 'messages'), newMessages[0]);
    }
  };

  /**
   * Renders the chat bubble with appropriate styling.
   * @param {object} props - The properties passed to the Bubble component.
   * @returns {JSX.Element} - The JSX element representing the rendered bubble.
   */
  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000',
          },
          left: {
            backgroundColor: '#FFF',
          },
        }}
      />
    );
  };

  /**
   * Renders the input toolbar based on the connection status.
   * @param {object} props - The properties passed to the InputToolbar component.
   * @returns {JSX.Element|null} - The JSX element representing the rendered input toolbar or null if not connected.
   */
  const renderInputToolbar = (props) => {
    return isConnected ? <InputToolbar {...props} /> : null;
  };

  /**
   * Renders the custom actions for the chat input.
   * @param {object} props - The properties passed to the CustomActions component.
   * @returns {JSX.Element} - The JSX element representing the custom actions.
   */
  const renderCustomActions = (props) => {
    return <CustomActions userID={userID} storage={storage} {...props} />;
  };

  /**
   * Renders the custom view based on the current message.
   * If the message contains a location, it renders a MapView with the location coordinates.
   * @param {object} props - The properties passed to the CustomView component.
   * @returns {JSX.Element|null} - The JSX element representing the custom view or null if not a location message.
   */
  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: userID,
          name: name,
        }}
      />

      {Platform.OS === 'android' && <KeyboardAvoidingView behavior="height" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;
