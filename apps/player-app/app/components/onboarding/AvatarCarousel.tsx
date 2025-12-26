
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable } from 'react-native';

const avatars = [
  // Replace with actual avatar images
  { id: '1', image: 'https://via.placeholder.com/80' },
  { id: '2', image: 'https://via.placeholder.com/80' },
  { id: '3', image: 'https://via.placeholder.com/80' },
  { id: '4', image: 'https://via.placeholder.com/80' },
];

interface AvatarCarouselProps {
  onSelect?: (avatarUrl: string) => void;
  selectedAvatar?: string | null;
}

const AvatarCarousel = ({ onSelect, selectedAvatar }: AvatarCarouselProps) => {
  return (
    <View style={styles.container}>
        <Text style={styles.label}>Choose an avatar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {avatars.map((avatar) => {
          const isSelected = selectedAvatar === avatar.image;
          return (
            <Pressable
              key={avatar.id}
              onPress={() => onSelect?.(avatar.image)}
              style={({ pressed }) => [
                styles.avatarWrapper,
                pressed && styles.pressed
              ]}
            >
              <Image 
                source={{ uri: avatar.image }} 
                style={[
                  styles.avatar,
                  isSelected && styles.avatarSelected
                ]} 
              />
            </Pressable>
          );
        })}
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
      textAlign: 'center',
      fontFamily: 'Inter',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  avatarWrapper: {
    marginHorizontal: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#14b8a6',
    borderWidth: 3,
  },
  pressed: {
    opacity: 0.7,
  },
});

export default AvatarCarousel;
