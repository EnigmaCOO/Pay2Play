import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface DashboardHeaderProps {
  onWalletPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

const DashboardHeader = ({ 
  onWalletPress, 
  onNotificationPress, 
  onProfilePress 
}: DashboardHeaderProps) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <View style={styles.logoShape} />
        </View>
        <Text style={styles.logoText}>Maidan</Text>
      </View>
      
      <View style={styles.iconsContainer}>
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onWalletPress}
        >
          <View style={styles.icon}>
            <View style={styles.walletIcon} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onNotificationPress}
        >
          <View style={styles.icon}>
            <View style={styles.bellIcon} />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={onProfilePress}
        >
          <View style={styles.icon}>
            <View style={styles.profileIcon} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#16a34a',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShape: {
    width: 28,
    height: 28,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    borderRadius: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  iconsContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  iconButton: {
    padding: 4,
  },
  icon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletIcon: {
    width: 24,
    height: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    borderTopWidth: 0,
    marginTop: 4,
  },
  bellIcon: {
    width: 20,
    height: 22,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
  },
});

export default DashboardHeader;
