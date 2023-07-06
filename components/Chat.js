import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chat = ({ route, navigation }) => {
  const { name, selectedColor } = route.params;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: name,
    });
  }, [navigation, name]);

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <Text style={styles.chatTitle}>{name}</Text>
      <Text style={styles.TXT}>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  TXT: {
    fontSize: 16,
    fontWeight: '300',
    color: '#FFFFFF',
  },

});

export default Chat;
