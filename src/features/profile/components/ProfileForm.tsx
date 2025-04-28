import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { profileStyles } from '../../../styles/profileStyles';
import { ProfileData } from '../../../services/profileService';

interface ProfileFormProps {
  profile: ProfileData;
  isEditing: boolean;
  displayNameMaxLength: number;
  bioMaxLength: number;
  onChangeDisplayName: (value: string) => void;
  onChangeBio: (value: string) => void;
}

export default function ProfileForm({
  profile,
  isEditing,
  displayNameMaxLength,
  bioMaxLength,
  onChangeDisplayName,
  onChangeBio
}: ProfileFormProps) {
  
  return (
    <View style={profileStyles.infoContainer}>
      <View style={profileStyles.inputContainer}>
        <Text style={profileStyles.inputLabel}>Display Name</Text>
        {isEditing ? (
          <>
            <TextInput
              style={profileStyles.input}
              value={profile.displayName}
              onChangeText={onChangeDisplayName}
              placeholder="Enter your display name"
              maxLength={displayNameMaxLength}
              editable={isEditing}
            />
            <Text style={profileStyles.characterCount}>
              {(profile.displayName?.length || 0)}/{displayNameMaxLength}
            </Text>
          </>
        ) : (
          <Text style={[profileStyles.input, { borderWidth: 0 }]}>
            {profile.displayName || 'No display name set'}
          </Text>
        )}
      </View>

      <View style={profileStyles.inputContainer}>
        <Text style={profileStyles.inputLabel}>Bio</Text>
        {isEditing ? (
          <>
            <TextInput
              style={[profileStyles.input, profileStyles.bioInput]}
              value={profile.bio}
              onChangeText={onChangeBio}
              placeholder="Tell us about yourself"
              multiline
              maxLength={bioMaxLength}
              editable={isEditing}
            />
            <Text style={profileStyles.characterCount}>
              {(profile.bio?.length || 0)}/{bioMaxLength}
            </Text>
          </>
        ) : (
          <Text style={[profileStyles.input, profileStyles.bioInput, { borderWidth: 0 }]}>
            {profile.bio || 'No bio set'}
          </Text>
        )}
      </View>
    </View>
  );
} 