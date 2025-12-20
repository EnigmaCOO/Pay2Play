
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileHeader = ({ user }) => {
  const { name, location, sports, skillLevel, avatar } = user || {};
  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar || 'https://via.placeholder.com/100' }} style={styles.avatar} />
      <Text style={styles.name}>{name || 'Player Name'}</Text>
      <Text style={styles.details}>{location || 'Location'} · {sports ? sports.join(', ') : 'Sports'}</Text>
      <Text style={styles.details}>Skill: {skillLevel || 'N/A'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#14b8a6',
  },
  name: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  details: {
    color: '#94a3b8',
    fontSize: 16,
    marginTop: 4,
  }
});

export default ProfileHeader;
