
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/main/HomeScreen';
// Placeholder screens for tabs
import { View, Text } from 'react-native';

const VenuesScreen = () => <View><Text>Venues</Text></View>;
const MatchesScreen = () => <View><Text>Matches</Text></View>;
const MessagesScreen = () => <View><Text>Messages</Text></View>;
const ProfileScreen = () => <View><Text>Profile</Text></View>;


const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
        // Basic styling, would be customized with glass effect
        screenOptions={{
            tabBarStyle: { backgroundColor: '#020617', borderTopColor: '#475569' },
            tabBarActiveTintColor: '#14b8a6',
            tabBarInactiveTintColor: '#94a3b8',
            headerShown: false,
        }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Venues" component={VenuesScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Me" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
