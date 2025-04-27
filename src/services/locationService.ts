import * as Location from 'expo-location';

// Ask permission and get user's current location
export const requestAndGetLocation = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  const loc = await Location.getCurrentPositionAsync({});
  return loc;
};

// Just get location without asking again (if already granted)
export const getCurrentLocation = async () => {
  const loc = await Location.getCurrentPositionAsync({});
  return loc;
};
