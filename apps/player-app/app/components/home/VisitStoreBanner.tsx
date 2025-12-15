import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VisitStoreBannerProps {
  onPress: () => void;
}

const VisitStoreBanner = ({ onPress }: VisitStoreBannerProps) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.banner}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <View style={styles.logoShape} />
          </View>
        </View>
        <Text style={styles.text}>VISIT STORE</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    height: 140,
  },
  banner: {
    flex: 1,
    backgroundColor: '#166534',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    position: 'absolute',
    left: 20,
    top: '50%',
    marginTop: -20,
  },
  logoIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShape: {
    width: 36,
    height: 36,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
});

export default VisitStoreBanner;
