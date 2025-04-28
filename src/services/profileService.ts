import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../firebase/firebaseConfig';

// Interface for profile data
export interface ProfileData {
  displayName?: string;
  photoURL?: string | null;
  bio?: string;
}

// Get current user profile
export const getUserProfile = async (): Promise<ProfileData | null> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      displayName: data.displayName,
      photoURL: data.photoURL,
      bio: data.bio
    };
  }
  
  return null;
};

// Update user profile data
export const updateUserProfile = async (profileData: ProfileData): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  // Create a copy of the data to be updated
  const dataToUpdate: Record<string, any> = {};
  
  // Only include defined fields
  if (profileData.displayName !== undefined) {
    dataToUpdate.displayName = profileData.displayName;
  }
  
  if (profileData.bio !== undefined) {
    dataToUpdate.bio = profileData.bio || '';  // Convert undefined/null to empty string
  }
  
  // Handle photoURL specially
  if (profileData.photoURL !== undefined) {
    dataToUpdate.photoURL = profileData.photoURL || '';  // Convert null to empty string
  }
  
  // Only proceed if we have data to update
  if (Object.keys(dataToUpdate).length > 0) {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, dataToUpdate, { merge: true });
  }
};

// Upload profile photo
export const uploadProfilePhoto = async (photoUri: string): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const response = await fetch(photoUri);
  const blob = await response.blob();
  
  const storageRef = ref(storage, `profilePhotos/${user.uid}`);
  const uploadTask = uploadBytesResumable(storageRef, blob);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress can be tracked here if needed
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        console.error('Storage error details:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateUserProfile({ photoURL: downloadURL });
        resolve(downloadURL);
      }
    );
  });
};

// Delete profile photo
export const deleteProfilePhoto = async (): Promise<void> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  const storageRef = ref(storage, `profilePhotos/${user.uid}`);
  
  try {
    await deleteObject(storageRef);
    await updateUserProfile({ photoURL: null });
  } catch (error) {
    if (error.code === 'storage/object-not-found') {
      // If the photo doesn't exist, just update the profile
      await updateUserProfile({ photoURL: null });
    } else {
      throw error;
    }
  }
}; 