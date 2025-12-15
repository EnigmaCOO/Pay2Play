
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import GlassCard from '../../../shared/ui/GlassCard';
import PrimaryButton from '../../../shared/ui/PrimaryButton';

interface MatchCardProps {
  type: 'host-led' | 'lfp';
  sport: string;
  title: string;
  time: string;
  location: string;
  playersInfo: string;
  actionLabel: string;
  onAction: () => void;
  badge?: string;
  paymentInfo?: string;
}

const MatchCard = ({ type, sport, title, time, location, playersInfo, actionLabel, onAction, badge, paymentInfo }: MatchCardProps) => {
  return (
    <GlassCard>
      <View style={styles.header}>
        <View style={styles.badges}>
            {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
            <View style={[styles.badge, styles.sportBadge]}><Text style={styles.badgeText}>{sport}</Text></View>
        </View>
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.time}>{time}</Text>
      <Text style={styles.location}>{location}</Text>
      
      <View style={styles.footer}>
        <View style={styles.info}>
            <Text style={styles.players}>{playersInfo}</Text>
            {paymentInfo && <Text style={styles.payment}>{paymentInfo}</Text>}
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={onAction}>
            <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  badges: {
      flexDirection: 'row',
  },
  badge: {
    backgroundColor: 'rgba(20, 184, 166, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#14b8a6',
  },
  sportBadge: {
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 14,
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
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
    paddingTop: 12,
  },
  info: {
      flex: 1,
  },
  players: {
      color: '#FFFFFF',
      fontSize: 14,
  },
  payment: {
      color: '#94a3b8',
      fontSize: 12,
      marginTop: 2,
  },
  actionButton: {
      backgroundColor: '#14b8a6',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 9999,
  },
  actionText: {
      color: 'white',
      fontWeight: 'bold',
  }
});

export default MatchCard;
