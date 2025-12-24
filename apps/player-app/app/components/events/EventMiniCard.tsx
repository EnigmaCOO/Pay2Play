
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';

interface EventMiniCardProps {
  title?: string;
  dateRange?: string;
  sport?: string;
}

const EventMiniCard = ({
  title = 'Ramzan Night League',
  dateRange = 'Feb 10 – Mar 05',
  sport = 'Football'
}: EventMiniCardProps) => {
  return (
    <GlassCard>
        <View style={styles.card}>
            <View style={styles.sportBadge}>
                <Text style={styles.sportText}>{sport}</Text>
            </View>
            <Text style={styles.title} numberOfLines={2}>{title}</Text>
            <Text style={styles.date}>{dateRange}</Text>
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    card: {
        width: 160,
        marginRight: 10,
        padding: 4,
    },
    sportBadge: {
        marginBottom: 8,
    },
    sportText: {
        color: '#f59e0b',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: 'Outfit',
        marginBottom: 4,
        height: 40, 
    },
    date: {
        color: '#94a3b8',
        fontSize: 12,
        fontFamily: 'Inter',
    }
});

export default EventMiniCard;
