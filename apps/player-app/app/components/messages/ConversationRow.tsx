
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface ConversationRowProps {
  id: string;
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  type: 'player' | 'venue' | 'group';
}

const ConversationRow = ({ id, name, message, time, unreadCount, type }: ConversationRowProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity style={styles.container} onPress={() => router.push(`/messages/${id}`)}>
      <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name[0]}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
            <Text style={[styles.name, unreadCount ? styles.bold : null]}>{name}</Text>
            <Text style={styles.time}>{time}</Text>
        </View>
        <View style={styles.footer}>
            <Text style={[styles.message, unreadCount ? styles.bold : null]} numberOfLines={1}>{message}</Text>
            {unreadCount ? (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 18,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    color: 'white',
    fontSize: 16,
  },
  bold: {
      fontWeight: 'bold',
      color: 'white',
  },
  time: {
    color: '#94a3b8',
    fontSize: 12,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  message: {
    color: '#94a3b8',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#14b8a6',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  }
});

export default ConversationRow;
