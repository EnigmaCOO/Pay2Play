
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GlassCard from '../../../../shared/ui/GlassCard';

const VenueCard = ({ venue }) => {
  const { name, address, city, imageUrls } = venue || {};
  const imageUri = imageUrls && imageUrls.length > 0 ? imageUrls[0] : 'https://via.placeholder.com/300x150';

  return (
    <GlassCard>
        <Image source={{ uri: imageUri }} style={styles.image} />
        <View style={styles.info}>
            <Text style={styles.name}>{name || 'Venue Name'}</Text>
            <Text style={styles.details}>{address || 'Venue address'}</Text>
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
