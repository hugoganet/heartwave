import { ScrollView, View, Text, Button, ActivityIndicator } from 'react-native';
import { useHomeLogic } from '../hooks/useHomeLogic';
import { homeStyles } from '../styles/homeStyles';
import UserCard from '../components/UserCard';

export default function HomeScreen({ navigation }: any) {
  const {
    location,
    nearbyUsers,
    heartsSent,
    errorMsg,
    loading,
    handleSendHeart,
    handleRefreshLocation,
    handleLogout,
  } = useHomeLogic(navigation);

  if (loading) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      <ScrollView contentContainerStyle={homeStyles.scrollContent}>
        <Text style={homeStyles.title}>Your Location:</Text>
        <Text style={homeStyles.locationText}>
          {errorMsg ? errorMsg : `Latitude: ${location?.coords.latitude}\nLongitude: ${location?.coords.longitude}`}
        </Text>

        <Text style={homeStyles.title}>People Around You 👀</Text>
        {nearbyUsers
          .filter((user) => !heartsSent.includes(user.id))
          .map((user) => (
            <UserCard key={user.id} userId={user.id} onSendHeart={handleSendHeart} />
          ))}

        <View style={homeStyles.buttonContainer}>
          <Button title="💬 View Matches" onPress={() => navigation.navigate('Matches')} />
        </View>

        <View style={homeStyles.buttonContainer}>
          <Button title="🔄 Refresh Location" onPress={handleRefreshLocation} />
        </View>

        <View style={homeStyles.buttonContainer}>
          <Button title="🚪 Logout" onPress={handleLogout} color="red" />
        </View>
      </ScrollView>
    </View>
  );
}
