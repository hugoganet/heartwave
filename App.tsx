import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";
import { app, db } from "./firebaseConfig"; 
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { collection, doc, getDocs, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; 

// Create the navigator
const Stack = createNativeStackNavigator();

// Distance calculation
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  const d = R * c; // in metres
  return d;
}

// Welcome Screen
function WelcomeScreen({ navigation }: any) {
  const handleLogin = async () => {
    try {
      const auth = getAuth(app);
      await signInAnonymously(auth);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Failed to login:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Heartwave ❤️</Text>
      <Button title="Enter App" onPress={handleLogin} />
      <StatusBar style="auto" />
    </View>
  );
}

// Home Screen
function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);

        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setErrorMsg("User not authenticated");
          return;
        }

        // Save user's location to Firestore
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          updatedAt: serverTimestamp(),
        }, { merge: true });
        console.log("✅ Location saved to Firestore!");

        // Fetch all users
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersList: any[] = [];

        usersSnapshot.forEach((docSnap) => {
          if (docSnap.id !== user.uid) {
            usersList.push({
              id: docSnap.id,
              ...docSnap.data()
            });
          }
        });

        console.log("Fetched users:", usersList);

        // Filter nearby users
        const nearby = usersList.filter((otherUser) => {
          if (!otherUser.latitude || !otherUser.longitude) return false;

          const distance = getDistance(
            loc.coords.latitude,
            loc.coords.longitude,
            otherUser.latitude,
            otherUser.longitude
          );

          return distance <= 50; // 50 meters
        });

        console.log("Nearby users:", nearby);

        setNearbyUsers(nearby);

      } catch (err) {
        console.error("🔥 Error in location or fetching users:", err);
      }
    })();
  }, []);

  // Sending a heart
  const handleSendHeart = async (targetUserId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const targetUserRef = doc(db, 'users', targetUserId);

      const userDoc = await getDoc(userRef);
      let heartsSent: string[] = [];

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data && data.heartsSent) {
          heartsSent = data.heartsSent;
        }
      }

      if (!heartsSent.includes(targetUserId)) {
        heartsSent.push(targetUserId);
        await setDoc(userRef, { heartsSent }, { merge: true });
        console.log(`❤️ Sent heart to ${targetUserId}`);
      }

      const targetDoc = await getDoc(targetUserRef);
      if (targetDoc.exists()) {
        const targetData = targetDoc.data();
        if (targetData && targetData.heartsSent && targetData.heartsSent.includes(user.uid)) {
          console.log("💥 It's a match!");
          Alert.alert('It\'s a Match!', 'You and the other person liked each other! ❤️');
        }
      }

    } catch (error) {
      console.error("🔥 Error sending heart:", error);
    }
  };

  let text = 'Waiting...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Location:</Text>
      <Text style={{ textAlign: 'center' }}>{text}</Text>

      <View style={{ marginTop: 30 }}>
        <Text style={styles.title}>People Around You 👀</Text>
        {nearbyUsers.length === 0 ? (
          <Text>No one nearby...</Text>
        ) : (
          nearbyUsers.map((user) => (
            <View key={user.id} style={{ marginBottom: 20, alignItems: 'center' }}>
              <Text>User ID: {user.id}</Text>
              <Button title="❤️ Send Heart" onPress={() => handleSendHeart(user.id)} />
            </View>
          ))
        )}
      </View>

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
