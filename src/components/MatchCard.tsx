import { View, Text } from 'react-native';

interface MatchCardProps {
  users: string[];
}

export default function MatchCard({ users }: MatchCardProps) {
  return (
    <View style={{ marginBottom: 20, alignItems: 'center' }}>
      <Text>Matched: {users.join(" ❤️ ")} </Text>
    </View>
  );
}
