
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SegmentedTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab} onPress={() => onTabChange(tab)}>
          <View style={[styles.tab, activeTab === tab && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 9999,
    padding: 4,
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 9999,
  },
  activeTab: {
    backgroundColor: '#14b8a6',
  },
  tabText: {
    color: '#FFFFFF',
  },
  activeTabText: {
    fontWeight: 'bold',
  }
});

export default SegmentedTabs;
