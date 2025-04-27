import { View, Text, Button, StyleSheet } from 'react-native';
import { anonymousLogin } from '../services/authService';

export default function WelcomeScreen({ navigation }: any) {
  // Function to handle anonymous login and navigate to Home
  const handleLogin = async () => {
    await anonymousLogin();
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Heartwave ❤️</Text>
      <Button title="Enter App" onPress={handleLogin} />
    </View>
  );
}

// Simple styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
