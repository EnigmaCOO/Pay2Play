import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api';
import { ProfileStatsSkeleton, SkeletonBox } from '@/components/SkeletonLoader';

type UserProfile = {
  id: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  countryCode: string | null;
  profileCompleteness: number | null;
  cricketPosition: string | null;
  footballPosition: string | null;
  padelPosition: string | null;
  skillLevel: string | null;
  gamesPlayed: number | null;
  facilitiesVisited: number | null;
  hoursPlayed: number | null;
};

const skillLevels = ['beginner', 'friendly', 'intermediate', 'high-level', 'masters'];
const cricketPositions = ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper'];
const footballPositions = ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'];
const padelPositions = ['Left', 'Right'];

const FLAG_MAP: Record<string, string> = {
  PK: '🇵🇰',
  US: '🇺🇸',
  UK: '🇬🇧',
  IN: '🇮🇳',
  AE: '🇦🇪',
};

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    countryCode: 'PK',
    cricketPosition: '',
    footballPosition: '',
    padelPosition: '',
    skillLevel: 'friendly',
  });

  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ['/api/users/profile', user?.uid],
    queryFn: async () => {
      const response = await apiClient.get(`/api/users/profile/${user?.uid}`);
      return response.data;
    },
    enabled: !!user?.uid,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof editForm) => {
      const completeness = calculateCompleteness(data);
      const response = await apiClient.put('/api/users/profile', {
        firebaseUid: user?.uid,
        ...data,
        profileCompleteness: completeness,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/profile', user?.uid] });
      setShowEditModal(false);
      Alert.alert('Success', 'Profile updated successfully');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update profile');
    },
  });

  const calculateCompleteness = (data: typeof editForm) => {
    let score = 30; // Base score
    if (data.displayName) score += 15;
    if (data.countryCode) score += 15;
    if (data.skillLevel) score += 15;
    if (data.cricketPosition || data.footballPosition || data.padelPosition) score += 15;
    return Math.min(score, 100);
  };

  const handleEditProfile = () => {
    setEditForm({
      displayName: profile?.displayName || '',
      countryCode: profile?.countryCode || 'PK',
      cricketPosition: profile?.cricketPosition || '',
      footballPosition: profile?.footballPosition || '',
      padelPosition: profile?.padelPosition || '',
      skillLevel: profile?.skillLevel || 'friendly',
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    if (!editForm.displayName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    updateProfileMutation.mutate(editForm);
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !profile) {
    return (
      <SafeAreaView className="flex-1 bg-navy-800">
        <View className="flex-1">
          <View className="px-6 py-4 border-b border-navy-700">
            <Text className="text-3xl font-bold text-white">
              Profile
            </Text>
            <Text className="text-navy-300 mt-1">
              Manage your account
            </Text>
          </View>
          <ScrollView className="flex-1 px-6 py-6">
            <View className="items-center mb-6">
              <SkeletonBox width={96} height={96} className="rounded-full mb-4" />
              <SkeletonBox width={150} height={28} className="mb-2" />
              <SkeletonBox width={100} height={16} className="mb-4" />
              <SkeletonBox width="80%" height={20} />
            </View>
            <ProfileStatsSkeleton />
            <View className="mt-6 space-y-4">
              <SkeletonBox width="100%" height={120} />
              <SkeletonBox width="100%" height={120} />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  const completeness = profile.profileCompleteness || 30;
  const needsCompletion = completeness < 100;

  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">
            Profile
          </Text>
          <Text className="text-navy-300 mt-1">
            Manage your account
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-6">
          {/* Profile Header */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-teal/20 items-center justify-center mb-4 border-2 border-teal">
              <Text className="text-teal font-bold text-3xl">
                {profile.displayName?.[0]?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Text className="text-white text-2xl font-bold">
                {profile.displayName || 'User'}
              </Text>
              {profile.countryCode && (
                <Text className="text-3xl ml-2">
                  {FLAG_MAP[profile.countryCode] || '🌍'}
                </Text>
              )}
            </View>
            <Text className="text-navy-300">
              {profile.email || profile.phoneNumber || 'No contact info'}
            </Text>

            {/* Profile Completeness */}
            <View className="w-full mt-4 px-6">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-navy-300 text-sm">Profile Completeness</Text>
                <Text className="text-teal font-semibold">{completeness}%</Text>
              </View>
              <View className="h-2 bg-navy-700 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-teal rounded-full"
                  style={{ width: `${completeness}%` }}
                />
              </View>
              {needsCompletion && (
                <TouchableOpacity
                  className="mt-3 bg-teal rounded-xl py-3"
                  onPress={handleEditProfile}
                  data-testid="button-finish-profile"
                >
                  <Text className="text-white font-semibold text-center">
                    Finish Profile
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row mb-6 gap-2">
            <View className="flex-1 bg-navy-700 rounded-xl p-4 items-center">
              <Text className="text-teal text-2xl font-bold">
                {profile.gamesPlayed || 0}
              </Text>
              <Text className="text-navy-300 text-sm mt-1">Games</Text>
            </View>
            <View className="flex-1 bg-navy-700 rounded-xl p-4 items-center">
              <Text className="text-gold text-2xl font-bold">
                {profile.facilitiesVisited || 0}
              </Text>
              <Text className="text-navy-300 text-sm mt-1">Facilities</Text>
            </View>
            <View className="flex-1 bg-navy-700 rounded-xl p-4 items-center">
              <Text className="text-blue-400 text-2xl font-bold">
                {profile.hoursPlayed || 0}
              </Text>
              <Text className="text-navy-300 text-sm mt-1">Hours</Text>
            </View>
          </View>

          {/* Sport Positions & Skill */}
          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <Text className="text-white font-semibold text-base mb-3">
              Sport Preferences
            </Text>
            
            {profile.skillLevel && (
              <View className="mb-3">
                <Text className="text-navy-400 text-sm mb-1">Skill Level</Text>
                <View className="bg-navy-600 px-3 py-2 rounded-lg inline-flex self-start">
                  <Text className="text-white capitalize">{profile.skillLevel}</Text>
                </View>
              </View>
            )}

            {profile.cricketPosition && (
              <View className="mb-3">
                <Text className="text-navy-400 text-sm mb-1">Cricket Position</Text>
                <View className="bg-orange-500/20 px-3 py-2 rounded-lg inline-flex self-start">
                  <Text className="text-orange-400">{profile.cricketPosition}</Text>
                </View>
              </View>
            )}

            {profile.footballPosition && (
              <View className="mb-3">
                <Text className="text-navy-400 text-sm mb-1">Football Position</Text>
                <View className="bg-blue-500/20 px-3 py-2 rounded-lg inline-flex self-start">
                  <Text className="text-blue-400">{profile.footballPosition}</Text>
                </View>
              </View>
            )}

            {profile.padelPosition && (
              <View className="mb-3">
                <Text className="text-navy-400 text-sm mb-1">Padel Position</Text>
                <View className="bg-purple-500/20 px-3 py-2 rounded-lg inline-flex self-start">
                  <Text className="text-purple-400">{profile.padelPosition}</Text>
                </View>
              </View>
            )}

            {!profile.cricketPosition && !profile.footballPosition && !profile.padelPosition && (
              <Text className="text-navy-500 text-sm">No sport positions set</Text>
            )}
          </View>

          {/* Settings */}
          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <Text className="text-white font-semibold text-base mb-3">
              Settings
            </Text>
            <TouchableOpacity 
              className="py-2"
              onPress={handleEditProfile}
              data-testid="button-edit-profile"
            >
              <Text className="text-navy-200">Edit Profile</Text>
            </TouchableOpacity>
            <View className="py-2 border-t border-navy-600">
              <Text className="text-navy-200">Notifications</Text>
            </View>
            <View className="py-2 border-t border-navy-600">
              <Text className="text-navy-200">Privacy</Text>
            </View>
            <View className="py-2 border-t border-navy-600">
              <Text className="text-navy-200">Help & Support</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-navy-700 rounded-xl p-4 mb-3"
            onPress={handleSignOut}
            data-testid="button-sign-out"
          >
            <Text className="text-red-400 font-semibold text-center">
              Sign Out
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-navy-800 rounded-t-3xl max-h-[85%]">
            <View className="px-6 py-4 border-b border-navy-700 flex-row items-center justify-between">
              <Text className="text-white text-xl font-bold">Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={28} color="#8dabc9" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-6 py-4">
              {/* Display Name */}
              <View className="mb-4">
                <Text className="text-navy-300 text-sm mb-2">Display Name</Text>
                <TextInput
                  className="bg-navy-700 rounded-xl px-4 py-3 text-white"
                  value={editForm.displayName}
                  onChangeText={(text) => setEditForm({ ...editForm, displayName: text })}
                  placeholder="Enter your name"
                  placeholderTextColor="#8dabc9"
                  data-testid="input-display-name"
                />
              </View>

              {/* Country */}
              <View className="mb-4">
                <Text className="text-navy-300 text-sm mb-2">Country</Text>
                <View className="flex-row flex-wrap gap-2">
                  {['PK', 'US', 'UK', 'IN', 'AE'].map((code) => (
                    <TouchableOpacity
                      key={code}
                      className={`px-4 py-2 rounded-xl ${editForm.countryCode === code ? 'bg-teal' : 'bg-navy-700'}`}
                      onPress={() => setEditForm({ ...editForm, countryCode: code })}
                      data-testid={`button-country-${code}`}
                    >
                      <Text className={editForm.countryCode === code ? 'text-white' : 'text-navy-300'}>
                        {FLAG_MAP[code]} {code}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Skill Level */}
              <View className="mb-4">
                <Text className="text-navy-300 text-sm mb-2">Skill Level</Text>
                <View className="flex-row flex-wrap gap-2">
                  {skillLevels.map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`px-4 py-2 rounded-xl ${editForm.skillLevel === level ? 'bg-teal' : 'bg-navy-700'}`}
                      onPress={() => setEditForm({ ...editForm, skillLevel: level })}
                      data-testid={`button-skill-${level}`}
                    >
                      <Text className={`capitalize ${editForm.skillLevel === level ? 'text-white' : 'text-navy-300'}`}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Cricket Position */}
              <View className="mb-4">
                <Text className="text-navy-300 text-sm mb-2">Cricket Position</Text>
                <View className="flex-row flex-wrap gap-2">
                  {cricketPositions.map((pos) => (
                    <TouchableOpacity
                      key={pos}
                      className={`px-4 py-2 rounded-xl ${editForm.cricketPosition === pos ? 'bg-orange-500' : 'bg-navy-700'}`}
                      onPress={() => setEditForm({ ...editForm, cricketPosition: pos })}
                      data-testid={`button-cricket-${pos}`}
                    >
                      <Text className={editForm.cricketPosition === pos ? 'text-white' : 'text-navy-300'}>
                        {pos}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Football Position */}
              <View className="mb-4">
                <Text className="text-navy-300 text-sm mb-2">Football Position</Text>
                <View className="flex-row flex-wrap gap-2">
                  {footballPositions.map((pos) => (
                    <TouchableOpacity
                      key={pos}
                      className={`px-4 py-2 rounded-xl ${editForm.footballPosition === pos ? 'bg-blue-500' : 'bg-navy-700'}`}
                      onPress={() => setEditForm({ ...editForm, footballPosition: pos })}
                      data-testid={`button-football-${pos}`}
                    >
                      <Text className={editForm.footballPosition === pos ? 'text-white' : 'text-navy-300'}>
                        {pos}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Padel Position */}
              <View className="mb-4">
                <Text className="text-navy-300 text-sm mb-2">Padel Position</Text>
                <View className="flex-row flex-wrap gap-2">
                  {padelPositions.map((pos) => (
                    <TouchableOpacity
                      key={pos}
                      className={`px-4 py-2 rounded-xl ${editForm.padelPosition === pos ? 'bg-purple-500' : 'bg-navy-700'}`}
                      onPress={() => setEditForm({ ...editForm, padelPosition: pos })}
                      data-testid={`button-padel-${pos}`}
                    >
                      <Text className={editForm.padelPosition === pos ? 'text-white' : 'text-navy-300'}>
                        {pos}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Save Button */}
              <TouchableOpacity
                className="bg-teal rounded-xl py-4 mb-6"
                onPress={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                data-testid="button-save-profile"
              >
                <Text className="text-white font-bold text-center">
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Profile'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
