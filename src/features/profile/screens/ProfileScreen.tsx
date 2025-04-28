import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { profileStyles } from '../../../styles/profileStyles';
import { useProfileLogic } from '../../../hooks/useProfileLogic';
import ProfilePhoto from '../components/ProfilePhoto';
import ProfileForm from '../components/ProfileForm';
import Toast from 'react-native-toast-message';

export default function ProfileScreen({ navigation }: any) {
  const {
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
  } = useProfileLogic(navigation);

  if (isLoading) {
    return (
      <View style={profileStyles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4285F4" />
          <Text style={{ marginTop: 20 }}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <ScrollView contentContainerStyle={profileStyles.scrollContent}>
        <Text style={profileStyles.title}>My Profile</Text>

        {error && (
          <Text style={profileStyles.errorText}>{error}</Text>
        )}

        <ProfilePhoto 
          photoURL={profile.photoURL}
          displayName={profile.displayName}
          isEditing={isEditing}
          isSaving={isSaving}
          onEditPhoto={pickImage}
          onRemovePhoto={removePhoto}
        />

        <ProfileForm 
          profile={profile}
          isEditing={isEditing}
          displayNameMaxLength={DISPLAY_NAME_MAX_LENGTH}
          bioMaxLength={BIO_MAX_LENGTH}
          onChangeDisplayName={(value) => handleProfileChange('displayName', value)}
          onChangeBio={(value) => handleProfileChange('bio', value)}
        />

        <View style={profileStyles.buttonContainer}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={profileStyles.saveButton} 
                onPress={saveProfile}
                disabled={isSaving || !isValidProfile()}
              >
                <Text style={[profileStyles.buttonText, profileStyles.saveButtonText]}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={profileStyles.cancelButton} 
                onPress={cancelEditing}
                disabled={isSaving}
              >
                <Text style={[profileStyles.buttonText, profileStyles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={profileStyles.saveButton} 
              onPress={startEditing}
            >
              <Text style={[profileStyles.buttonText, profileStyles.saveButtonText]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={[profileStyles.cancelButton, { marginTop: -10, marginBottom: 20 }]} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[profileStyles.buttonText, profileStyles.cancelButtonText]}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Toast />
    </View>
  );
} 