import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const TabBarIcon = ({ type, focused }: { type: string; focused: boolean }) => {
  const iconColor = focused ? '#16a34a' : '#64748b';
  
  switch (type) {
    case 'booking':
      return (
        <View style={[styles.tabIcon, styles.bookingIcon, focused && styles.focusedIcon]}>
          <View style={[styles.bookingShape, { borderColor: iconColor }]} />
        </View>
      );
    case 'create':
      return (
        <View style={[styles.tabIcon, styles.createIcon]}>
          <View style={styles.plusHorizontal} />
          <View style={styles.plusVertical} />
        </View>
      );
    case 'home':
      return (
        <View style={styles.homeButton}>
          <View style={styles.homeIconContainer}>
            <View style={[styles.logoShape]} />
          </View>
        </View>
      );
    case 'chat':
      return (
        <View style={[styles.tabIcon, styles.chatIcon, focused && styles.focusedIcon]}>
          <View style={[styles.chatBubble, { borderColor: iconColor }]} />
        </View>
      );
    case 'more':
      return (
        <View style={[styles.tabIcon, styles.moreIcon]}>
          <View style={[styles.dot, { backgroundColor: iconColor }]} />
          <View style={[styles.dot, { backgroundColor: iconColor }]} />
          <View style={[styles.dot, { backgroundColor: iconColor }]} />
        </View>
      );
    default:
      return null;
  }
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#64748b',
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Booking',
          tabBarIcon: ({ focused }) => <TabBarIcon type="booking" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="venues"
        options={{
          title: 'Create',
          tabBarIcon: ({ focused }) => <TabBarIcon type="create" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: '',
          tabBarIcon: ({ focused }) => <TabBarIcon type="home" focused={focused} />,
          tabBarIconStyle: styles.homeIconStyle,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => <TabBarIcon type="chat" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'More',
          tabBarIcon: ({ focused }) => <TabBarIcon type="more" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="matches"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#16a34a',
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 4,
  },
  tabIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusedIcon: {
    opacity: 1,
  },
  bookingIcon: {},
  bookingShape: {
    width: 20,
    height: 16,
    borderWidth: 2,
    borderRadius: 4,
  },
  createIcon: {
    position: 'relative',
  },
  plusHorizontal: {
    width: 20,
    height: 2,
    backgroundColor: '#64748b',
    position: 'absolute',
  },
  plusVertical: {
    width: 2,
    height: 20,
    backgroundColor: '#64748b',
    position: 'absolute',
  },
  homeButton: {
    width: 56,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  homeIconContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoShape: {
    width: 24,
    height: 24,
    backgroundColor: '#16a34a',
    transform: [{ rotate: '45deg' }],
    borderRadius: 3,
  },
  homeIconStyle: {
    marginBottom: 20,
  },
  chatIcon: {},
  chatBubble: {
    width: 20,
    height: 18,
    borderWidth: 2,
    borderRadius: 10,
    borderBottomLeftRadius: 2,
  },
  moreIcon: {
    flexDirection: 'column',
    gap: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
