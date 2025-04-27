import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { getAuth } from 'firebase/auth';
import { getCurrentLocation, requestAndGetLocation } from '../services/locationService';
import { saveUserLocation, sendHeart, saveMatchIfMutual, listenToNearbyUsers } from '../services/firestoreService';
import { logout } from '../services/authService';
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

export const useHomeLogic = (navigation: any) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [heartsSent, setHeartsSent] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const refreshTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

        const loc = await requestAndGetLocation();
        setLocation(loc);

        await saveUserLocation(user.uid, loc.coords.latitude, loc.coords.longitude);

        // Fetch my own heartsSent list
        const userRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userRef);
        if (userSnapshot.exists()) {
          const data = userSnapshot.data();
          if (data && data.heartsSent) {
            setHeartsSent(data.heartsSent);
          }
        }

        // Start listening to nearby users
        unsubscribe = listenToNearbyUsers(user.uid, (users) => {
          setNearbyUsers(users);
        });

        // Auto-refresh location every 30 sec
        refreshTimerRef.current = setInterval(async () => {
          try {
            const loc = await getCurrentLocation();
            setLocation(loc);

            await saveUserLocation(user.uid, loc.coords.latitude, loc.coords.longitude);
            Toast.show({
              type: 'success',
              text1: '📍 Location Updated',
              visibilityTime: 1500,
            });
          } catch (error) {
            console.error("🔥 Error during auto-refresh:", error);
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
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  const handleSendHeart = async (targetUserId: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      await sendHeart(user.uid, targetUserId);
      const isMatch = await saveMatchIfMutual(user.uid, targetUserId);

      // Immediately update local heartsSent and nearbyUsers
      setHeartsSent((prev) => [...prev, targetUserId]);
      setNearbyUsers((prev) => prev.filter((user) => user.id !== targetUserId));

      if (isMatch) {
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
        visibilityTime: 1500,
      });
    } catch (error) {
      console.error("🔥 Error refreshing location:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Welcome');
    } catch (error) {
      console.error("🔥 Error during logout:", error);
    }
  };

  return {
    location,
    nearbyUsers,
    heartsSent,
    errorMsg,
    loading,
    handleSendHeart,
    handleRefreshLocation,
    handleLogout,
  };
};
