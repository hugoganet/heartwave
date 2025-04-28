import React from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { profileStyles } from '../../../styles/profileStyles';

interface ProfilePhotoProps {
  photoURL: string | undefined;
  displayName: string | undefined;
  isEditing: boolean;
  isSaving: boolean;
  onEditPhoto: () => void;
  onRemovePhoto: () => void;
}

export default function ProfilePhoto({
  photoURL,
  displayName,
  isEditing,
  isSaving,
  onEditPhoto,
  onRemovePhoto
}: ProfilePhotoProps) {

  // Get the first letter of the display name for the default avatar
  const getInitial = (): string => {
    if (displayName && displayName.length > 0) {
      return displayName[0].toUpperCase();
    }
    return '?';
  };

  return (
    <View style={profileStyles.photoContainer}>
      {photoURL ? (
        <Image 
          source={{ uri: photoURL }} 
          style={profileStyles.profilePhoto} 
        />
      ) : (
        <View style={profileStyles.defaultAvatar}>
          <Text style={profileStyles.defaultAvatarText}>{getInitial()}</Text>
        </View>
      )}

      {isSaving && (
        <ActivityIndicator 
          size="large" 
          color="#4285F4" 
          style={{ position: 'absolute', top: 60 }} 
        />
      )}

      {isEditing && (
        <View style={profileStyles.photoButtonsContainer}>
          <TouchableOpacity 
            style={profileStyles.photoButton} 
            onPress={onEditPhoto}
            disabled={isSaving}
          >
            <Text>Change Photo</Text>
          </TouchableOpacity>
          
          {photoURL && (
            <TouchableOpacity 
              style={profileStyles.photoButton} 
              onPress={onRemovePhoto}
              disabled={isSaving}
            >
              <Text>Remove Photo</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
} 