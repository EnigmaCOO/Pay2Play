import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Notifications from 'expo-notifications';
import apiClient from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentSheet } from '@/components/PaymentSheet';
import { SkeletonBox } from '@/components/SkeletonLoader';

type GameWithDetails = {
  id: string;
  hostId: string;
  fieldId: string;
  sport: string;
  startTime: string;
  endTime: string;
  minPlayers: number;
  maxPlayers: number;
  pricePerPlayerPkr: number;
  status: string;
  currentPlayers: number;
  createdAt: string;
  field: {
    id: string;
    name: string;
    sport: string;
    venue: {
      id: string;
      name: string;
      city: string;
      address: string;
      imageUrl?: string;
    };
  };
  host: {
    id: string;
    name: string;
  };
  players?: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
    };
  }>;
};

type TabType = 'roster' | 'about' | 'map';

const sportIcons: Record<string, string> = {
  cricket: 'baseball',
  football: 'football',
  futsal: 'football',
  padel: 'tennisball',
};

const sportColors: Record<string, string> = {
  cricket: '#f59e0b',
  football: '#3b82f6',
  futsal: '#3b82f6',
  padel: '#a855f7',
};

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('roster');
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);

  const { data: game, isLoading, refetch } = useQuery<GameWithDetails>({
    queryKey: ['/api/games', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/games/${id}`);
      return response.data;
    },
  });

  const joinGameMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const userId = user.uid;
      const idempotencyKey = `join-${id}-${userId}-${Date.now()}`;
      
      const response = await apiClient.post(`/api/game-pay/${id}/intent`, {
        userId,
        provider: 'mock',
        idempotencyKey,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      // Simulate payment processing with mock provider
      setShowPaymentSheet(true);
    },
    onError: (error: any) => {
      console.error('Failed to join game:', error);
    },
  });

  const handlePaymentSuccess = async () => {
    setShowPaymentSheet(false);
    
    // Refetch game data to show updated roster
    await refetch();
    
    // Show local notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You're going!",
        body: `Your spot is confirmed for ${game?.sport} at ${game?.field.venue.name}`,
        data: { gameId: id },
      },
      trigger: null, // Show immediately
    });
  };

  if (isLoading || !game) {
    return (
      <SafeAreaView className="flex-1 bg-navy-800">
        <View className="flex-1">
          {/* Header Skeleton */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-navy-700">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <SkeletonBox width={80} height={20} />
            <View style={{ width: 24 }} />
          </View>
          
          {/* Image Skeleton */}
          <SkeletonBox width="100%" height={200} className="rounded-none" />
          
          {/* Content Skeleton */}
          <ScrollView className="flex-1 px-6 py-4">
            <SkeletonBox width="70%" height={28} className="mb-2" />
            <SkeletonBox width="50%" height={20} className="mb-4" />
            <SkeletonBox width="100%" height={40} className="mb-6" />
            
            {/* Tabs Skeleton */}
            <View className="flex-row mb-4">
              <SkeletonBox width={80} height={32} className="mr-2" />
              <SkeletonBox width={80} height={32} className="mr-2" />
              <SkeletonBox width={80} height={32} />
            </View>
            
            {/* Players Skeleton */}
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="flex-row items-center mb-3">
                <SkeletonBox width={40} height={40} className="rounded-full mr-3" />
                <SkeletonBox width={120} height={20} />
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  if (!game) {
    return (
      <SafeAreaView className="flex-1 bg-navy-800">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#14b8a6" />
          <Text className="text-navy-400 mt-4">Loading game details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sportColor = sportColors[game.sport] || '#14b8a6';
  const progressPercentage = (game.currentPlayers / game.maxPlayers) * 100;
  const isScheduled = game.currentPlayers < game.minPlayers;
  const isConfirmed = game.currentPlayers >= game.minPlayers && game.currentPlayers < game.maxPlayers;
  const isFull = game.currentPlayers >= game.maxPlayers;

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-navy-700">
        <TouchableOpacity onPress={() => router.back()} data-testid="button-back">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">Game Details</Text>
        <TouchableOpacity data-testid="button-share">
          <Ionicons name="share-outline" size={24} color="#8dabc9" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Venue Header Image */}
        <View className="relative h-48 bg-navy-700">
          {game.field.venue.imageUrl ? (
            <Image
              source={{ uri: game.field.venue.imageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <View 
                className="w-20 h-20 rounded-full items-center justify-center"
                style={{ backgroundColor: sportColor + '20' }}
              >
                <Ionicons 
                  name={sportIcons[game.sport] as any} 
                  size={40} 
                  color={sportColor} 
                />
              </View>
            </View>
          )}
          
          {/* Overlay with venue name and distance */}
          <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-4">
            <Text className="text-white text-2xl font-bold mb-1">
              {game.field.venue.name}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#14b8a6" />
              <Text className="text-teal ml-1 font-medium">
                2.5 km away
              </Text>
              <Text className="text-navy-300 ml-2">• {game.field.venue.city}</Text>
            </View>
          </View>
        </View>

        {/* Game Info */}
        <View className="px-6 py-5 border-b border-navy-700">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View 
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: sportColor + '20' }}
              >
                <Ionicons 
                  name={sportIcons[game.sport] as any} 
                  size={24} 
                  color={sportColor} 
                />
              </View>
              <View>
                <Text className="text-white text-xl font-bold capitalize">
                  {game.sport}
                </Text>
                <Text className="text-navy-300 text-sm">
                  {game.field.name}
                </Text>
              </View>
            </View>
            <Text className="text-teal text-2xl font-bold">
              PKR {game.pricePerPlayerPkr}
            </Text>
          </View>

          <View className="flex-row items-center mb-3">
            <Ionicons name="calendar-outline" size={20} color="#8dabc9" />
            <Text className="text-white ml-3 font-medium">
              {formatDate(game.startTime)}
            </Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#8dabc9" />
            <Text className="text-white ml-3 font-medium">
              {formatTime(game.startTime)} - {formatTime(game.endTime)}
            </Text>
          </View>
        </View>

        {/* Roster Progress */}
        <View className="px-6 py-5 border-b border-navy-700">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-white text-lg font-semibold">Roster</Text>
            <Text className="text-navy-300">
              {game.currentPlayers}/{game.maxPlayers} players
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="mb-3">
            <View className="h-2 bg-navy-600 rounded-full overflow-hidden">
              <View 
                className="h-full bg-teal rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </View>
          </View>

          {/* Status Indicators */}
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-2 ${isScheduled ? 'bg-teal' : 'bg-navy-600'}`} />
              <Text className={`text-sm ${isScheduled ? 'text-teal' : 'text-navy-400'}`}>
                Scheduled
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-2 ${isConfirmed ? 'bg-teal' : 'bg-navy-600'}`} />
              <Text className={`text-sm ${isConfirmed ? 'text-teal' : 'text-navy-400'}`}>
                Confirmed
              </Text>
            </View>
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-2 ${isFull ? 'bg-teal' : 'bg-navy-600'}`} />
              <Text className={`text-sm ${isFull ? 'text-teal' : 'text-navy-400'}`}>
                Full
              </Text>
            </View>
          </View>

          {!isFull && (
            <Text className="text-navy-300 text-sm mt-3">
              {game.minPlayers - game.currentPlayers > 0
                ? `${game.minPlayers - game.currentPlayers} more ${game.minPlayers - game.currentPlayers === 1 ? 'player' : 'players'} needed to confirm`
                : `${game.maxPlayers - game.currentPlayers} ${game.maxPlayers - game.currentPlayers === 1 ? 'spot' : 'spots'} left`}
            </Text>
          )}
        </View>

        {/* Tabs */}
        <View className="px-6 py-4 border-b border-navy-700">
          <View className="flex-row bg-navy-700 rounded-lg p-1">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${activeTab === 'roster' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('roster')}
              data-testid="button-tab-roster"
            >
              <Text className={`text-center font-semibold ${activeTab === 'roster' ? 'text-white' : 'text-navy-300'}`}>
                Roster
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${activeTab === 'about' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('about')}
              data-testid="button-tab-about"
            >
              <Text className={`text-center font-semibold ${activeTab === 'about' ? 'text-white' : 'text-navy-300'}`}>
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-md ${activeTab === 'map' ? 'bg-teal' : ''}`}
              onPress={() => setActiveTab('map')}
              data-testid="button-tab-map"
            >
              <Text className={`text-center font-semibold ${activeTab === 'map' ? 'text-white' : 'text-navy-300'}`}>
                Map
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        <View className="px-6 py-5 mb-24">
          {activeTab === 'roster' && (
            <View>
              {/* Invite Friends Button */}
              <TouchableOpacity
                className="bg-navy-700 rounded-xl p-4 mb-4 flex-row items-center justify-between border border-teal/30"
                onPress={() => router.push('/(tabs)/friends')}
                data-testid="button-invite-friends"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full bg-teal/20 items-center justify-center mr-3">
                    <Ionicons name="person-add" size={20} color="#14b8a6" />
                  </View>
                  <Text className="text-white font-semibold">Invite Friends</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#8dabc9" />
              </TouchableOpacity>

              {game.players && game.players.length > 0 ? (
                <View>
                  {/* Team Layout */}
                  <View className="flex-row gap-3 mb-4">
                    {/* Team 1 */}
                    <View className="flex-1">
                      <View className="bg-teal/10 rounded-t-xl px-3 py-2 border-b-2 border-teal">
                        <Text className="text-teal font-bold text-center">Team 1</Text>
                      </View>
                      <View className="bg-navy-700 rounded-b-xl">
                        {game.players
                          .filter((_, idx) => idx % 2 === 0)
                          .map((player, index) => (
                            <View
                              key={player.userId}
                              className={`p-3 ${index < Math.ceil(game.players.length / 2) - 1 ? 'border-b border-navy-600' : ''}`}
                              data-testid={`team1-player-${index}`}
                            >
                              <View className="flex-row items-center mb-2">
                                <View className="w-8 h-8 rounded-full bg-teal/20 items-center justify-center mr-2">
                                  <Text className="text-teal font-bold text-sm">
                                    {player.user.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                                <View className="flex-1">
                                  <Text className="text-white font-medium text-sm">
                                    {player.user.name}
                                  </Text>
                                </View>
                              </View>
                              <View className="flex-row flex-wrap gap-1">
                                {player.userId === game.hostId && (
                                  <View className="bg-gold/20 px-2 py-0.5 rounded">
                                    <Text className="text-gold text-xs font-semibold">Host</Text>
                                  </View>
                                )}
                                {/* Mock friend badge - would check actual friendship status */}
                                {index === 1 && (
                                  <View className="bg-teal/20 px-2 py-0.5 rounded">
                                    <Text className="text-teal text-xs font-semibold">Friend</Text>
                                  </View>
                                )}
                                {/* Skill level chip */}
                                <View className="bg-navy-600 px-2 py-0.5 rounded">
                                  <Text className="text-navy-300 text-xs">
                                    {player.userId === game.hostId ? 'High-Level' : index === 0 ? 'Intermediate' : 'Friendly'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>

                    {/* Team 2 */}
                    <View className="flex-1">
                      <View className="bg-gold/10 rounded-t-xl px-3 py-2 border-b-2 border-gold">
                        <Text className="text-gold font-bold text-center">Team 2</Text>
                      </View>
                      <View className="bg-navy-700 rounded-b-xl">
                        {game.players
                          .filter((_, idx) => idx % 2 === 1)
                          .map((player, index) => (
                            <View
                              key={player.userId}
                              className={`p-3 ${index < Math.floor(game.players.length / 2) - 1 ? 'border-b border-navy-600' : ''}`}
                              data-testid={`team2-player-${index}`}
                            >
                              <View className="flex-row items-center mb-2">
                                <View className="w-8 h-8 rounded-full bg-gold/20 items-center justify-center mr-2">
                                  <Text className="text-gold font-bold text-sm">
                                    {player.user.name.charAt(0).toUpperCase()}
                                  </Text>
                                </View>
                                <View className="flex-1">
                                  <Text className="text-white font-medium text-sm">
                                    {player.user.name}
                                  </Text>
                                </View>
                              </View>
                              <View className="flex-row flex-wrap gap-1">
                                {player.userId === game.hostId && (
                                  <View className="bg-gold/20 px-2 py-0.5 rounded">
                                    <Text className="text-gold text-xs font-semibold">Host</Text>
                                  </View>
                                )}
                                {/* Skill level chip */}
                                <View className="bg-navy-600 px-2 py-0.5 rounded">
                                  <Text className="text-navy-300 text-xs">
                                    {player.userId === game.hostId ? 'High-Level' : index === 0 ? 'Intermediate' : 'Beginner'}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          ))}
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <View className="py-8 items-center">
                  <Ionicons name="people-outline" size={48} color="#374151" />
                  <Text className="text-navy-400 mt-3">No players yet</Text>
                  <Text className="text-navy-500 text-sm mt-1">Be the first to join!</Text>
                </View>
              )}
            </View>
          )}

          {activeTab === 'about' && (
            <View>
              <Text className="text-white text-lg font-semibold mb-4">Game Details</Text>
              
              <View className="mb-4">
                <Text className="text-navy-400 text-sm mb-1">Hosted by</Text>
                <Text className="text-white font-medium">{game.host.name}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-navy-400 text-sm mb-1">Sport</Text>
                <Text className="text-white font-medium capitalize">{game.sport}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-navy-400 text-sm mb-1">Venue</Text>
                <Text className="text-white font-medium">{game.field.venue.name}</Text>
                <Text className="text-navy-400 text-sm mt-1">{game.field.venue.address}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-navy-400 text-sm mb-1">Field</Text>
                <Text className="text-white font-medium">{game.field.name}</Text>
              </View>

              <View className="mb-4">
                <Text className="text-navy-400 text-sm mb-1">Player Range</Text>
                <Text className="text-white font-medium">
                  {game.minPlayers} - {game.maxPlayers} players
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-navy-400 text-sm mb-1">Price per Player</Text>
                <Text className="text-teal text-xl font-bold">PKR {game.pricePerPlayerPkr}</Text>
              </View>
            </View>
          )}

          {activeTab === 'map' && (
            <View className="items-center py-12">
              <View className="w-20 h-20 rounded-full bg-navy-700 items-center justify-center mb-4">
                <Ionicons name="map-outline" size={40} color="#8dabc9" />
              </View>
              <Text className="text-white text-lg font-semibold mb-2">Map View</Text>
              <Text className="text-navy-400 text-center">
                Map integration coming soon
              </Text>
              <View className="mt-6 bg-navy-700 rounded-lg p-4 w-full">
                <Text className="text-navy-300 text-sm">
                  <Text className="font-semibold">Address:</Text> {game.field.venue.address}
                </Text>
                <Text className="text-navy-300 text-sm mt-2">
                  <Text className="font-semibold">City:</Text> {game.field.venue.city}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Join Game Button */}
      {!isFull && (
        <View className="absolute bottom-0 left-0 right-0 bg-navy-800 border-t border-navy-700 px-6 py-4">
          <TouchableOpacity
            className="bg-teal rounded-xl py-4 items-center"
            onPress={() => joinGameMutation.mutate()}
            disabled={joinGameMutation.isPending}
            data-testid="button-join-game"
          >
            {joinGameMutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-bold">
                Join Game • PKR {game.pricePerPlayerPkr}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Sheet */}
      <PaymentSheet
        visible={showPaymentSheet}
        amount={game.pricePerPlayerPkr}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaymentSheet(false)}
      />
    </SafeAreaView>
  );
}
