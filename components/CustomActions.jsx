import React from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/**
 * CustomActions component provides buttons for choosing images, taking photos, and sending location data.
 *
 * @param {object} props - The component props.
 * @param {object} props.wrapperStyle - Additional styles for the container wrapping the action button.
 * @param {object} props.iconTextStyle - Additional styles for the icon text inside the action button.
 * @param {function} props.onSend - Function to handle sending messages.
 * @param {object} props.storage - Firebase Storage reference.
 * @param {string} props.userID - The unique user ID for the current user.
 * @returns {JSX.Element} - The JSX element representing the CustomActions component.
 */
const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const actionSheet = useActionSheet();

  /**
   * Handles the action button press event and shows the action sheet with options.
   */
  const onActionPress = async () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions({ options, cancelButtonIndex }, async (buttonIndex) => {
      switch (buttonIndex) {
        case 0:
          await pickImage();
          break;
        case 1:
          await takePhoto();
          break;
        case 2:
          await getLocation();
          break;
        default:
          break;
      }
    });
  };

  /**
   * Uploads the image to Firebase Storage and sends the image URL in a message.
   * @param {string} imageURI - The local URI of the image to upload.
   */
  const uploadAndSendImage = async (imageURI) => {
    try {
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      const snapshot = await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(snapshot.ref);
      console.log('Image uploaded');
      onSend({ image: imageURL });
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  /**
   * Opens the image picker and allows the user to choose an image from the library.
   */
  const pickImage = async () => {
    try {
      let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissions?.granted) {
        let result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
          await uploadAndSendImage(result.assets[0].uri);
        } else {
          Alert.alert('Image selection canceled.');
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  /**
   * Opens the device's camera and allows the user to take a photo.
   */
  const takePhoto = async () => {
    try {
      let permissions = await ImagePicker.requestCameraPermissionsAsync();
      if (permissions?.granted) {
        let result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) {
          await uploadAndSendImage(result.assets[0].uri);
        } else {
          Alert.alert('Camera access canceled.');
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  /**
   * Fetches the user's current location and sends the location data in a message.
   */
  const getLocation = async () => {
    try {
      let permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions?.granted) {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
          onSend({
            location: {
              longitude: location.coords.longitude,
              latitude: location.coords.latitude,
            },
          });
        } else {
          Alert.alert('Error occurred while fetching location.');
        }
      } else {
        Alert.alert("Permissions haven't been granted.");
      }
    } catch (error) {
      console.error('Error fetching location:', error);
    }
  };

  /**
   * Generates a unique reference string for the image in Firebase Storage.
   * @param {string} uri - The URI of the image.
   * @returns {string} - The unique reference string for the image.
   */
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/').pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onActionPress}>
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 15,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;
