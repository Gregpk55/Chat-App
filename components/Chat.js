import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

//chat components + setting state
const Chat = ({ db, storage, route, navigation }) => {
  const { name, selectedColor, userID } = route.params;
  const [messages, setMessages] = useState([]);

  //updating from firebase collections
  useEffect(() => {
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: {
            _id: data.user._id,
            name: data.user.name,
          },
        };
      });
      setMessages(newMessages);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, []);
  
 //new message submit
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };
 

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: userID,
          name: name,
        }}
        renderBubble={renderBubble}
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
