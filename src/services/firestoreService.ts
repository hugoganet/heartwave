import { db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc, serverTimestamp, onSnapshot, collection, getDocs } from 'firebase/firestore';

// Save or update user's current location in Firestore
export const saveUserLocation = async (uid: string, latitude: number, longitude: number) => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    latitude,
    longitude,
    updatedAt: serverTimestamp(),
  }, { merge: true }); // merge:true means only update these fields, don't overwrite everything
};

// Send a heart to another user (add their ID into heartsSent array)
export const sendHeart = async (fromUid: string, toUid: string) => {
  const userRef = doc(db, 'users', fromUid);
  const userDoc = await getDoc(userRef);
  let heartsSent: string[] = [];

  if (userDoc.exists()) {
    const data = userDoc.data();
    if (data && data.heartsSent) {
      heartsSent = data.heartsSent;
    }
  }

  if (!heartsSent.includes(toUid)) {
    heartsSent.push(toUid);
    await setDoc(userRef, { heartsSent }, { merge: true });
  }
};

// Check if the target user already sent a heart back, and save the match
export const saveMatchIfMutual = async (fromUid: string, toUid: string): Promise<boolean> => {
  const targetRef = doc(db, 'users', toUid);
  const targetDoc = await getDoc(targetRef);

  if (targetDoc.exists()) {
    const targetData = targetDoc.data();
    if (targetData && targetData.heartsSent && targetData.heartsSent.includes(fromUid)) {
      const matchId = [fromUid, toUid].sort().join("_"); // Unique match ID based on sorted UIDs
      const matchRef = doc(db, 'matches', matchId);

      await setDoc(matchRef, {
        users: [fromUid, toUid],
        createdAt: serverTimestamp(),
      });

      return true; // It's a match!
    }
  }
  return false; // Not a mutual match yet
};

// Real-time listener to get all other users (excluding myself)
export const listenToNearbyUsers = (myUid: string, onUpdate: (users: any[]) => void) => {
  const usersRef = collection(db, "users");

  return onSnapshot(usersRef, (snapshot) => {
    const usersList: any[] = [];

    snapshot.forEach((docSnap) => {
      if (docSnap.id !== myUid) {
        usersList.push({
          id: docSnap.id,
          ...docSnap.data()
        });
      }
    });

    onUpdate(usersList);
  });
};

// Fetch all matches for the current user (not real-time, one-time fetch)
export const fetchMatches = async (myUid: string) => {
  const matchesRef = collection(db, "matches");
  const snapshot = await getDocs(matchesRef);
  const myMatches: any[] = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data && data.users && data.users.includes(myUid)) {
      myMatches.push(data);
    }
  });

  return myMatches;
};
