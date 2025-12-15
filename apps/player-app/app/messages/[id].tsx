
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenBackground from '../../shared/ui/ScreenBackground';
import AppHeader from '../../shared/ui/AppHeader';

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  
  const messages = [
      { id: '1', sender: 'Ali', text: 'Hey, are we still on for 8 sharp?', time: '7:05 PM', isMe: false },
      { id: '2', sender: 'You', text: 'Yes, I will be there at 7:50.', time: '7:06 PM', isMe: true },
      { id: '3', sender: 'Venue', text: 'Ground ready from 7:45. Use Gate 2.', time: '7:10 PM', isMe: false, isVenue: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <AppHeader title="5-a-side tonight" onBack={() => router.back()} />
        <View style={styles.contextPill}>
            <Text style={styles.contextText}>Star Futsal Arena · DHA Phase 5</Text>
            <TouchableOpacity><Text style={styles.contextLink}>View booking</Text></TouchableOpacity>
        </View>
      </View>
      
      <ScreenBackground>
        <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
                <View style={[
                    styles.bubbleContainer, 
                    item.isMe ? styles.meContainer : styles.otherContainer
                ]}>
                    <View style={[
                        styles.bubble, 
                        item.isMe ? styles.meBubble : (item.isVenue ? styles.venueBubble : styles.otherBubble)
                    ]}>
                        {item.isVenue && <Text style={styles.senderName}>Venue</Text>}
                        {!item.isMe && !item.isVenue && <Text style={styles.senderName}>{item.sender}</Text>}
                        <Text style={styles.messageText}>{item.text}</Text>
                        <Text style={styles.timeText}>{item.time}</Text>
                    </View>
                </View>
            )}
            contentContainerStyle={{ paddingBottom: 80 }}
        />
      </ScreenBackground>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Type a message..." 
            placeholderTextColor="#94a3b8"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
              <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#020617',
  },
  headerContainer: {
      backgroundColor: '#020617',
      zIndex: 10,
  },
  contextPill: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      padding: 8,
      marginHorizontal: 16,
      borderRadius: 8,
      marginBottom: 10,
  },
  contextText: {
      color: '#cbd5e1',
      fontSize: 12,
  },
  contextLink: {
      color: '#14b8a6',
      fontSize: 12,
      fontWeight: 'bold',
  },
  bubbleContainer: {
      marginVertical: 4,
      width: '100%',
  },
  meContainer: {
      alignItems: 'flex-end',
  },
  otherContainer: {
      alignItems: 'flex-start',
  },
  bubble: {
      maxWidth: '80%',
      padding: 12,
      borderRadius: 16,
  },
  meBubble: {
      backgroundColor: '#14b8a6',
      borderBottomRightRadius: 4,
  },
  otherBubble: {
      backgroundColor: '#334155',
      borderBottomLeftRadius: 4,
  },
  venueBubble: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#14b8a6',
      borderBottomLeftRadius: 4,
  },
  senderName: {
      color: '#cbd5e1',
      fontSize: 10,
      marginBottom: 2,
  },
  messageText: {
      color: 'white',
      fontSize: 14,
  },
  timeText: {
      color: '#e2e8f0',
      fontSize: 10,
      alignSelf: 'flex-end',
      marginTop: 4,
      opacity: 0.8,
  },
  inputContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#0f172a',
      borderTopWidth: 1,
      borderTopColor: '#334155',
  },
  input: {
      flex: 1,
      backgroundColor: '#1e293b',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      color: 'white',
      marginRight: 10,
  },
  sendButton: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 10,
  },
  sendText: {
      color: '#14b8a6',
      fontSize: 24,
  }
});

export default ChatScreen;
