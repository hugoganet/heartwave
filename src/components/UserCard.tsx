import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

interface UserCardProps {
  userId: string;
  onSendHeart: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ userId, onSendHeart }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.text}>User ID: {userId}</Text>
      <Button title="❤️ Send Heart" onPress={() => onSendHeart(userId)} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default UserCard;