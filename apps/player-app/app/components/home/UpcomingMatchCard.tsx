import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface UpcomingMatchCardProps {
  title: string;
  organizer: string;
  players: number;
  maxPlayers: number;
  thumbnailUrl?: string;
  onPress: () => void;
}

const UpcomingMatchCard = ({ 
  title, 
  organizer, 
  players, 
  maxPlayers, 
  thumbnailUrl,
  onPress 
}: UpcomingMatchCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.thumbnail}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={styles.thumbnailImage} />
        ) : (
          <View style={styles.placeholderThumbnail}>
            <View style={styles.ballIcon} />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.organizer}>by {organizer}</Text>
      </View>
      
      <View style={styles.playerCount}>
        <Text style={styles.playerCountText}>{players}/{maxPlayers}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#84cc16',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  organizer: {
    fontSize: 14,
    color: '#94a3b8',
  },
  playerCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#16a34a',
    backgroundColor: 'transparent',
  },
  playerCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default UpcomingMatchCard;
