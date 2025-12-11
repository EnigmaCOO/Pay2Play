
import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';

const VenueImageCarousel = ({ images }) => {
  const imageList = images && images.length > 0 ? images : ['https://via.placeholder.com/400x200'];

  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
        {imageList.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.image} />
        ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 400, // Should be screen width
    height: 200,
  },
});

export default VenueImageCarousel;
