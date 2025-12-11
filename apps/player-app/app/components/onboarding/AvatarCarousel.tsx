
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const avatars = [
  // Replace with actual avatar images
  { id: '1', image: 'https://via.placeholder.com/80' },
  { id: '2', image: 'https://via.placeholder.com/80' },
  { id: '3', image: 'https://via.placeholder.com/80' },
  { id: '4', image: 'https://via.placeholder.com/80' },
];

const AvatarCarousel = () => {
  return (
    <View style={styles.container}>
        <Text style={styles.label}>Choose an avatar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {avatars.map((avatar) => (
            <Image key={avatar.id} source={{ uri: avatar.image }} style={styles.avatar} />
        ))}
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  label: {
      color: '#FFFFFF',
      fontSize: 16,
      marginBottom: 10,
      textAlign: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginHorizontal: 8,
    borderWidth: 2,
    borderColor: '#14b8a6', // Highlight selected
  },
});

export default AvatarCarousel;
