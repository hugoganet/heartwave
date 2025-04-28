import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadProfilePhoto, 
  deleteProfilePhoto,
  ProfileData 
} from '../services/profileService';

export const useProfileLogic = (navigation: any) => {
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    photoURL: '',
    bio: ''
  });
  const [originalProfile, setOriginalProfile] = useState<ProfileData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Character limits
  const DISPLAY_NAME_MAX_LENGTH = 30;
  const BIO_MAX_LENGTH = 160;

  // Load user profile data
  const loadProfile = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userProfile = await getUserProfile();
      
      if (userProfile) {
        setProfile(userProfile);
        setOriginalProfile(userProfile);
      }
    } catch (err) {
      console.error('🔥 Error loading profile:', err);
      setError('Failed to load profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile state
  const handleProfileChange = (key: keyof ProfileData, value: string): void => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [key]: value
    }));
  };

  // Start editing mode
  const startEditing = (): void => {
    setIsEditing(true);
  };

  // Cancel editing mode
  const cancelEditing = (): void => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  // Save profile changes
  const saveProfile = async (): Promise<void> => {
    setIsSaving(true);
    setError(null);
    
    try {
      // Prepare profile data, ensuring no undefined values
      const profileDataToSave: ProfileData = {};
      
      if (profile.displayName !== undefined) {
        profileDataToSave.displayName = profile.displayName;
      }
      
      if (profile.bio !== undefined) {
        profileDataToSave.bio = profile.bio;
      }
      
      await updateUserProfile(profileDataToSave);
      
      setOriginalProfile(profile);
      setIsEditing(false);
      Toast.show({
        type: 'success',
        text1: 'Profile updated successfully',
      });
    } catch (err) {
      console.error('🔥 Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Failed to save profile',
        text2: 'Please try again',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Pick image from gallery
  const pickImage = async (): Promise<void> => {
    setError(null);
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        setError('Permission to access gallery was denied');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets[0].uri) {
        setIsSaving(true);
        const downloadURL = await uploadProfilePhoto(result.assets[0].uri);
        setProfile(prevProfile => ({
          ...prevProfile,
          photoURL: downloadURL
        }));
        setOriginalProfile(prevProfile => ({
          ...prevProfile,
          photoURL: downloadURL
        }));
        Toast.show({
          type: 'success',
          text1: 'Photo updated successfully',
        });
      }
    } catch (err) {
      console.error('🔥 Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Failed to upload photo',
        text2: 'Please try again',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Remove profile photo
  const removePhoto = async (): Promise<void> => {
    setError(null);
    
    try {
      setIsSaving(true);
      await deleteProfilePhoto();
      setProfile(prevProfile => ({
        ...prevProfile,
        photoURL: ''
      }));
      setOriginalProfile(prevProfile => ({
        ...prevProfile,
        photoURL: ''
      }));
      Toast.show({
        type: 'success',
        text1: 'Photo removed successfully',
      });
    } catch (err) {
      console.error('🔥 Error removing photo:', err);
      setError('Failed to remove photo. Please try again.');
      Toast.show({
        type: 'error',
        text1: 'Failed to remove photo',
        text2: 'Please try again',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Validation
  const isValidProfile = (): boolean => {
    if (profile.displayName && profile.displayName.length > DISPLAY_NAME_MAX_LENGTH) {
      return false;
    }
    
    if (profile.bio && profile.bio.length > BIO_MAX_LENGTH) {
      return false;
    }
    
    return true;
  };

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  return {
    profile,
    isLoading,
    isEditing,
    isSaving,
    error,
    DISPLAY_NAME_MAX_LENGTH,
    BIO_MAX_LENGTH,
    handleProfileChange,
    startEditing,
    cancelEditing,
    saveProfile,
    pickImage,
    removePhoto,
    isValidProfile,
  };
}; 