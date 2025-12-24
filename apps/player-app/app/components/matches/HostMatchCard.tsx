
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';
import PrimaryButton from '@shared/ui/PrimaryButton';

interface HostMatchCardProps {
  sport?: string;
  format?: string;
  time?: string;
  location?: string;
  venue?: string;
  playersNeeded?: number;
  onJoinPress?: () => void;
}

const HostMatchCard = ({
  sport = 'Football',
  format = '5-a-side',
  time = 'Tonight · 9:00 PM',
  location = 'DHA Phase 5',
  venue = 'Turf Arena',
  playersNeeded = 2,
  onJoinPress
}: HostMatchCardProps) => {
  return (
    <GlassCard>
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.sportText}>{sport} · {format}</Text>
            </View>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.locationText}>{location} · {venue}</Text>
            
            <View style={styles.footerRow}>
                <Text style={styles.needsText}>Needs {playersNeeded} players</Text>
                <View style={styles.buttonWrapper}>
                    <PrimaryButton title="Join" onPress={onJoinPress || (() => {})} />
                </View>
            </View>
            {/* Avatar row placeholder */}
            <View style={styles.avatarRow}>
                <View style={[styles.avatar, { backgroundColor: '#3b82f6' }]} />
                <View style={[styles.avatar, { backgroundColor: '#10b981', marginLeft: -8 }]} />
                <View style={[styles.avatar, { backgroundColor: '#6366f1', marginLeft: -8 }]} />
            </View>
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    card: {
        width: 260,
        marginRight: 10,
        padding: 4,
    },
    headerRow: {
        marginBottom: 4,
    },
    sportText: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'Inter',
        textTransform: 'uppercase',
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
        fontFamily: 'Outfit',
    },
    locationText: {
        color: '#cbd5e1',
        fontSize: 14,
        marginBottom: 12,
        fontFamily: 'Inter',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    needsText: {
        color: '#f59e0b', // Amber for "needs"
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Inter',
    },
    buttonWrapper: {
        width: 80,
    },
    avatarRow: {
        flexDirection: 'row',
        marginTop: 4,
    },
    avatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1e293b',
    }
});

export default HostMatchCard;
