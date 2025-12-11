
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SectionHeader = ({ title, cta, onCtaPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {cta && 
        <TouchableOpacity onPress={onCtaPress}>
            <Text style={styles.cta}>{cta} →</Text>
        </TouchableOpacity>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cta: {
    color: '#14b8a6',
    fontWeight: 'bold'
  },
});

export default SectionHeader;
