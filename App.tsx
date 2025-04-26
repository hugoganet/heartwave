import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

// Create the navigator
const Stack = createNativeStackNavigator();

// Welcome Screen
function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Heartwave ❤️</Text>
      <Button title="Enter App" onPress={() => navigation.navigate('Home')} />
      <StatusBar style="auto" />
    </View>
  );
}

// Home Screen
function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find people nearby 👀</Text>
      <StatusBar style="auto" />
    </View>
  );
}

// App root
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
