
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GlassCard from '../../../../shared/ui/GlassCard';

const VenueCard = () => {
  return (
    <GlassCard>
        <Image source={{ uri: 'https://via.placeholder.com/300x150' }} style={styles.image} />
        <View style={styles.info}>
            <Text style={styles.name}>Star Futsal Arena</Text>
            <Text style={styles.details}>DHA · 5-a-side · Indoor</Text>
            <Text style={styles.price}>From PKR 5,000 / hour</Text>
        </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    info: {
        padding: 8,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    details: {
        color: '#94a3b8',
        marginVertical: 4,
    },
    price: {
        color: '#FFFFFF',
    }
});

export default VenueCard;
