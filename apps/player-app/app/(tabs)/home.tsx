import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, ActivityIndicator } from 'react-native';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';

const aiChatCallable = httpsCallable(functions, 'aiChat');

export default function HomeScreen() {
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);
  const [chatLoading, setChatLoading] = useState(false);

  const handleSend = async () => {
    if (chatInput.trim() === '') return;

    const userMessage = chatInput;
    setChatHistory((prev) => [...prev, { sender: 'User', message: userMessage }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const result: any = await aiChatCallable({ message: userMessage });
      if (result.data && result.data.success) {
        setChatHistory((prev) => [...prev, { sender: 'AI', message: result.data.response }]);
      } else {
        setChatHistory((prev) => [...prev, { sender: 'AI', message: 'Error: Could not get a response.' }]);
      }
    } catch (error) {
      console.error('Error calling aiChat:', error);
      setChatHistory((prev) => [...prev, { sender: 'AI', message: `Error: ${error.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AI Assistant</Text>
      
      <ScrollView style={styles.chatHistory}>
        {chatHistory.map((chat, index) => (
          <View key={index} style={chat.sender === 'User' ? styles.userMessageContainer : styles.aiMessageContainer}>
            <Text style={chat.sender === 'User' ? styles.userMessage : styles.aiMessage}>
              {chat.message}
            </Text>
          </View>
        ))}
        {chatLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text>AI is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything..."
          value={chatInput}
          onChangeText={setChatInput}
          onSubmitEditing={handleSend}
          editable={!chatLoading}
        />
        <Button title="Send" onPress={handleSend} disabled={chatLoading || chatInput.trim() === ''} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  chatHistory: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  aiMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    fontSize: 16,
    color: '#000',
  },
  aiMessage: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#fff',
  },
});
