import { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { fetchMatches } from '../services/firestoreService';
import MatchCard from '../components/MatchCard';

export default function MatchesScreen({ navigation }: any) {
  const [matches, setMatches] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setErrorMsg('User not authenticated');
          return;
        }

        const myMatches = await fetchMatches(user.uid);
        setMatches(myMatches);

      } catch (err) {
        console.error('🔥 Error fetching matches:', err);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Matches title */}
        <Text style={styles.title}>Your Matches ❤️</Text>

        {/* Error message */}
        {errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : matches.length === 0 ? (
          <Text style={styles.infoText}>No matches yet...</Text>
        ) : (
          matches.map((match, index) => (
            <MatchCard key={index} users={match.users} />
          ))
        )}

        {/* Back to Home button */}
        <View style={styles.buttonContainer}>
          <Button title="⬅️ Back to Home" onPress={() => navigation.navigate('Home')} />
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
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  infoText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 40,
    width: '80%',
  },
});
