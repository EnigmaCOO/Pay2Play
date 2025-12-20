
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const VenueHeader = ({ name, onBack }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.backButton}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.name}>{name}</Text>
      <View style={{ flexDirection: 'row'}}>
        <TouchableOpacity><Text style={styles.icon}>♥</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.icon}>⋮</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    height: 60,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 30,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 15,
  }
});

export default VenueHeader;
