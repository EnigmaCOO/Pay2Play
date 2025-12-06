import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Platform, Alert } from 'react-native';
import { User, onAuthStateChanged, signInAnonymously, signOut } from 'firebase/auth';
import { auth, functions } from '../../lib/firebase'; // Corrected import path
import * as Notifications from 'expo-notifications';
import { httpsCallable } from 'firebase/functions';

const updateUserProfileCallable = httpsCallable(functions, 'updateUserProfile');

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // If user logs in, attempt to register for push notifications
      if (currentUser) {
        registerForPushNotificationsAsync().then(token => {
          if (token) {
            setPushToken(token);
          }
        });
      } else {
        setPushToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Permission denied', 'Failed to get push token for push notification!');
      return null;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);

      if (user && token) {
        // Send the token to your backend
        await updateUserProfileCallable({ expoPushToken: token });
        Alert.alert('Success', 'Push notifications enabled!');
      }

      return token;
    } catch (error) {
      console.error('Error getting Expo Push Token or sending to backend:', error);
      Alert.alert('Error', 'Could not register for push notifications.');
      return null;
    }
  }

  const handleLogin = async () => {
    try {
      await signInAnonymously(auth);
      console.log('Signed in anonymously');
    } catch (error) {
      console.error('Error signing in anonymously:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <Text>Welcome, User: {user.uid}</Text>
          {pushToken ? (
            <Text>Push notifications enabled.</Text>
          ) : (
            <Button title="Enable Push Notifications" onPress={registerForPushNotificationsAsync} />
          )}
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Button title="Login Anonymously" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
