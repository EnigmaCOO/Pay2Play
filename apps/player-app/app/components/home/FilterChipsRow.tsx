
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Chip from '@shared/ui/Chip';

const FilterChipsRow = () => {
    // State for selected chip would be managed here
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            <Chip label="Tonight" selected={true} onPress={() => {}}/>
            <Chip label="This weekend" onPress={() => {}}/>
            <Chip label="My sports" onPress={() => {}}/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    }
})

export default FilterChipsRow;
