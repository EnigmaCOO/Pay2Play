
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GlassCard from '@shared/ui/GlassCard';

interface VenueCardProps {
  name?: string;
  area?: string;
  price?: string;
  discount?: string;
  nextSlot?: string;
  imageUrl?: string;
}

const VenueCard = ({ 
  name = 'Star Futsal Arena',
  area = 'DHA Phase 5',
  price = 'PKR 5,000 / hr',
  discount = 'Save 20%',
  nextSlot = 'Tonight: 8 PM',
  imageUrl
}: VenueCardProps) => {
  const imageUri = imageUrl || 'https://via.placeholder.com/300x150';

  return (
    <GlassCard>
        <View style={styles.card}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <View style={styles.info}>
                <View style={styles.headerRow}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    {discount && (
                        <View style={styles.discountBadge}>
                            <Text style={styles.discountText}>{discount}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.details}>{area}</Text>
                
                <View style={styles.footerRow}>
                    <Text style={styles.price}>{price}</Text>
                    {nextSlot && (
                        <View style={styles.slotChip}>
                            <Text style={styles.slotText}>{nextSlot}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    card: {
        width: 280,
        marginRight: 10,
    },
    image: {
        width: '100%',
        height: 140,
        borderRadius: 8,
        marginBottom: 8,
    },
    info: {
        padding: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Outfit',
        flex: 1,
        marginRight: 8,
    },
    details: {
        color: '#94a3b8',
        fontSize: 14,
        marginBottom: 8,
        fontFamily: 'Inter',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'Inter',
    },
    discountBadge: {
        backgroundColor: '#10b981',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    slotChip: {
        backgroundColor: 'rgba(56, 189, 248, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.4)',
    },
    slotText: {
        color: '#38bdf8',
        fontSize: 12,
        fontWeight: '500',
    }
});

export default VenueCard;
