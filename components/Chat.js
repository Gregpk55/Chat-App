import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { collection, addDoc, onSnapshot, query, orderBy, } from "firebase/firestore";



//chat components + setting state
const Chat = ({ db, route, navigation, isConnected }) => {
  const { name, userID, selectedColor } = route.params;
  const [messages, setMessages] = useState([]);
  
 

  //updating from firebase collections
  useEffect(() => {
    if (isConnected) {
      navigation.setOptions({ title: name });
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, async (snapshot) => {
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

      //cache messages using AsyncStorage
      AsyncStorage.setItem("cachedMessages", JSON.stringify(newMessages))
          .then(() => {
            setMessages(newMessages);
          })
          .catch((error) => {
            console.log("Error caching messages:", error);
          });
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };

    //get cached messages using AsyncStorage
  } else {
    AsyncStorage.getItem("cachedMessages")
      .then((cachedMessages) => {
        if (cachedMessages) {
          const parsedMessages = JSON.parse(cachedMessages);
          setMessages(parsedMessages);
        }
      })
      .catch((error) => {
        console.log("Error loading cached messages:", error);
      });
  }
 
 }, [isConnected]);

//new message submit
const onSend = (newMessages) => {
  if (isConnected) {
    addDoc(collection(db, "messages"), newMessages[0]);
  } 
};


const renderInputToolbar = (props) => {
  if (isConnected) {
    return <InputToolbar {...props} />;
  } else {
    return null;
  }
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
        renderInputToolbar={renderInputToolbar}
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
