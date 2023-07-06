import { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "react-native-screens/native-stack";

const Stack = createNativeStackNavigator();

const Start = ({ navigation }) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleStartChatting = () => {
    navigation.navigate("Chat", { name, selectedColor });
  };
//selects color & highlights chosen
  const ColorOption = ({ color, isSelected }) => {
    return (
      <TouchableOpacity
        style={[
          styles.colorOption,
          { backgroundColor: color },
          isSelected && styles.selectedColorOption,
        ]}
        onPress={() => setSelectedColor(color)}
      >
        {isSelected && <View style={styles.selectedColorRing} />}
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/BackgroundImage.png")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <View style={styles.subContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder="Type your username here"
            placeholderTextColor="#757083"
          />
          
          <Text style={styles.label}>Choose background color</Text>
          <View style={styles.colorOptionsContainer}>
            <ColorOption
              color="#090C08"
              isSelected={selectedColor === "#090C08"}
            />
            <ColorOption
              color="#474056"
              isSelected={selectedColor === "#474056"}
            />
            <ColorOption
              color="#8A95A5"
              isSelected={selectedColor === "#8A95A5"}
            />
            <ColorOption
              color="#B9C6AE"
              isSelected={selectedColor === "#B9C6AE"}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleStartChatting}>
            <Text style={styles.buttonText}>Start chatting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};
// bckgrnd color name
const Chat = ({ route }) => {
  const { name, selectedColor } = route.params;

  return (
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      <Text style={styles.chatTitle}>Chat</Text>
      <Text style={styles.username}>{name}</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  subContainer: {
    marginTop: 100,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF",
    opacity: 0.7,
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  textInput: {
    width: 200,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#757083",
    marginTop: 5,
    marginBottom: 20,
    color: "#757083",
    opacity: 0.6,
    backgroundColor: "white",
  },
  colorOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedColorOption: {
    borderWidth: 0.5,
    borderColor: "#FFFFFF",
  },
  selectedColorRing: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#757083",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  chatTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "300",
    color: "#FFFFFF",
  },
});

export default Start;