
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import SegmentedTabs from '../../shared/ui/SegmentedTabs';
import ConversationRow from '../components/messages/ConversationRow';

export default function MessagesScreen() {
  const [activeTab, setActiveTab] = useState('All');

  const conversations = [
      { id: '1', name: 'Ali', message: 'We’ll bring the ball.', time: '9:24 PM', unreadCount: 3, type: 'player' },
      { id: '2', name: 'Star Futsal Arena', message: 'Venue: Gate opens 15 mins early.', time: 'Yesterday', type: 'venue' },
      { id: '3', name: 'Sunday Padel Squad', message: 'You: Got it, see you there.', time: 'Sun 11:30', type: 'group' },
  ];

  return (
    <ScreenBackground>
      <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity><Text style={styles.menu}>⋮</Text></TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Chat with teammates and venues.</Text>
      
      <SegmentedTabs 
        tabs={['All', 'Players', 'Venues']} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <FlatList 
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
            <ConversationRow 
                id={item.id}
                name={item.name}
                message={item.message}
                time={item.time}
                unreadCount={item.unreadCount}
                type={item.type as any}
            />
        )}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  menu: {
      color: 'white',
      fontSize: 24,
  },
  subtitle: {
      color: '#94a3b8',
      marginBottom: 10,
  }
});
