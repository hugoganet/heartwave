import { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { getAuth } from 'firebase/auth';
import { saveUserLocation, sendHeart, saveMatchIfMutual, listenToNearbyUsers } from '../services/firestoreService';
import { logout } from '../services/authService';
import { requestAndGetLocation, getCurrentLocation } from '../services/locationService';
import UserCard from '../components/UserCard';
import Toast from 'react-native-toast-message';


export default function HomeScreen({ navigation }: any) {
  const [location, setLocation] = useState<{ coords: { latitude: number; longitude: number } } | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Reference for the auto-refresh timer
  const refreshTimerRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.log('No user, redirecting to Welcome');
          navigation.navigate('Welcome');
          return;
        }

        // Request permission and fetch initial location
        const loc = await requestAndGetLocation();
        setLocation(loc);

        // Save location to Firestore
        await saveUserLocation(user.uid, loc.coords.latitude, loc.coords.longitude);

        // Start real-time listener to fetch nearby users
        unsubscribe = listenToNearbyUsers(user.uid, (users) => {
          setNearbyUsers(users);
        });

        // Auto-refresh location every 30 seconds
        refreshTimerRef.current = setInterval(async () => {
          try {
            const loc = await getCurrentLocation();
            setLocation(loc);

            await saveUserLocation(user.uid, loc.coords.latitude, loc.coords.longitude);
			await saveUserLocation(user.uid, loc.coords.latitude, loc.coords.longitude);
		  Toast.show({
		    type: 'success',
		    text1: '📍 Location Updated',
		    visibilityTime: 1500,
		  });
		  console.log("📍 Auto-Location refreshed");

            console.log("📍 Auto-Location refreshed");
          } catch (error) {
            console.error("🔥 Error during auto-refresh location:", error);
          }
        }, 30000);

      } catch (err: any) {
        console.error('🔥 Error fetching location or users:', err);
        setErrorMsg(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe();
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current as any);
      }
    };
  }, []);

  // Send a heart to another user
  const handleSendHeart = async (targetUserId: string) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    await sendHeart(user.uid, targetUserId);
    const isMatch = await saveMatchIfMutual(user.uid, targetUserId);

    // Remove the user from nearbyUsers immediately
    setNearbyUsers((prevUsers) => prevUsers.filter((user) => user.id !== targetUserId));

    if (isMatch) {
      Alert.alert('❤️ It\'s a Match!', 'You and the other person liked each other!');
      Toast.show({
        type: 'success',
        text1: '❤️ It\'s a Match!',
        visibilityTime: 2000,
      });
    }
  } catch (error) {
    console.error('🔥 Error sending heart:', error);
  }
};



  // Manual refresh of location
  const handleRefreshLocation = async () => {
    try {
      const loc = await getCurrentLocation();
      setLocation(loc);

      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      await saveUserLocation(user.uid, loc.coords.latitude, loc.coords.longitude);
	   Toast.show({
 		 type: 'success',
 		 text1: '📍 Location Updated',
 		 visibilityTime: 1500, // 1.5 seconds
	  });
      console.log("✅ Location refreshed manually!");
    } catch (error) {
      console.error("🔥 Error refreshing location:", error);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Welcome');
      console.log("✅ Logged out and navigated to Welcome");
    } catch (error) {
      console.error("🔥 Error during logout:", error);
    }
  };

  // Build display text for current location
  let locationText = 'Waiting...';
  if (errorMsg) {
    locationText = errorMsg;
  } else if (location) {
    locationText = `Latitude: ${location?.coords.latitude}\nLongitude: ${location?.coords.longitude}`;
  }

  // Show loading spinner during initial fetch
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Main UI
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Display current location */}
        <Text style={styles.title}>Your Location:</Text>
        <Text style={styles.locationText}>{locationText}</Text>

        {/* Display nearby users */}
        <Text style={styles.title}>People Around You 👀</Text>
        {nearbyUsers.length === 0 ? (
          <Text style={styles.infoText}>No one nearby...</Text>
        ) : (
          nearbyUsers.map((user) => (
            <UserCard key={user.id} userId={user.id} onSendHeart={handleSendHeart} />
          ))
        )}

        {/* View Matches button */}
        <View style={styles.buttonContainer}>
          <Button title="💬 View Matches" onPress={() => navigation.navigate('Matches')} />
        </View>

        {/* Manual refresh location button */}
        <View style={styles.buttonContainer}>
          <Button title="🔄 Refresh Location" onPress={handleRefreshLocation} />
        </View>

        {/* Logout button */}
        <View style={styles.buttonContainer}>
          <Button title="🚪 Logout" onPress={handleLogout} color="red" />
        </View>

      </ScrollView>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  locationText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
  },
  infoText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
  },
  buttonContainer: {
    marginTop: 20,
    width: '80%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
