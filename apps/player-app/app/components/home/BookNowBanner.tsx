import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';

interface BookNowBannerProps {
  onPress: () => void;
}

const BookNowBanner = ({ onPress }: BookNowBannerProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.banner}>
        <View style={styles.overlay} />
        <Text style={styles.text}>BOOK NOW</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 160,
  },
  banner: {
    flex: 1,
    backgroundColor: '#166534',
    justifyContent: 'center',
    paddingLeft: 32,
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    transform: [{ skewX: '-15deg' }],
  },
  text: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

export default BookNowBanner;
