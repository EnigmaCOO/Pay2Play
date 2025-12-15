import { useState, useEffect } from 'react';
import { Button, StyleSheet, View, ScrollView } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import ScreenBackground from '@shared/ui/ScreenBackground';
import ProfileHeader from '../components/profile/ProfileHeader';
import StatsRow from '../components/profile/StatsRow';
import RewardsSummaryCard from '../components/profile/RewardsSummaryCard';
import ProfileMenuList from '../components/profile/ProfileMenuList';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const mockUser = {
      name: user ? user.uid : 'Player',
      location: 'Lahore',
      sports: ['Football', 'Cricket'],
      skillLevel: 'Intermediate',
      avatar: 'https://via.placeholder.com/100',
  }

  const mockStats = {
      games: 12,
      venues: 4,
      credits: 450,
  }

  const mockRewards = {
      credits: 450,
      totalSaved: 3200,
      biggestDiscount: 900,
  }

  return (
    <ScreenBackground>
        <ScrollView>
            <ProfileHeader user={mockUser} />
            <StatsRow stats={mockStats} />
            <RewardsSummaryCard rewards={mockRewards} />
            <ProfileMenuList />
            <View style={styles.logoutButton}>
                <Button title="Logout" onPress={handleLogout} color="#14b8a6"/>
            </View>
        </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
      marginTop: 20,
      marginHorizontal: 16,
  }
});
