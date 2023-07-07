import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { name, selectedColor } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const systemMessage = {
      _id: 0,
      text: `Welcome to the chat, ${name}!`,
      createdAt: new Date(),
      system: true,
    };

    const userMessage = {
      _id: 1,
      text: 'Hello, how are you?',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'User',
      },
    };

    setMessages([systemMessage, userMessage]); // set message
  }, [name]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => setMessages(previousMessages => GiftedChat.append(previousMessages, messages))} 
        user={{
          _id: 1
        }}
      />
      
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      
    </View>
  );
};

const renderBubble = (props) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        //chat bubble color
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  //chat
  container: {
    flex: 1,
   
  },
});

export default Chat;
