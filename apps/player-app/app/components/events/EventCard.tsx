
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import GlassCard from '../../../shared/ui/GlassCard';

interface EventCardProps {
  id: string;
  title: string;
  sport: string;
  date: string;
  location: string;
  price?: string;
  badge?: string;
  actionLabel?: string;
}

const EventCard = ({ id, title, sport, date, location, price, badge, actionLabel = 'Register' }: EventCardProps) => {
  const router = useRouter();

  return (
    <GlassCard>
      <TouchableOpacity onPress={() => router.push(`/leagues/${id}`)}>
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
        </View>
        <Text style={styles.details}>{sport} · {date}</Text>
        <Text style={styles.location}>{location}</Text>
        
        <View style={styles.footer}>
            {price && <Text style={styles.price}>{price}</Text>}
            <TouchableOpacity style={styles.button} onPress={() => router.push(`/leagues/${id}`)}>
                <Text style={styles.buttonText}>{actionLabel}</Text>
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
  },
  title: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
      flex: 1,
  },
  badge: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#f59e0b',
  },
  badgeText: {
      color: '#fbbf24',
      fontSize: 10,
      fontWeight: 'bold',
  },
  details: {
      color: 'white',
      marginBottom: 2,
  },
  location: {
      color: '#94a3b8',
      fontSize: 14,
      marginBottom: 12,
  },
  footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTopWidth: 1,
      borderTopColor: 'rgba(148, 163, 184, 0.2)',
      paddingTop: 12,
  },
  price: {
      color: 'white',
      fontWeight: 'bold',
  },
  button: {
      backgroundColor: '#3b82f6',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
  }
});

export default EventCard;
