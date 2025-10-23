import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DiscoverScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">
            Discover
          </Text>
          <Text className="text-navy-300 mt-1">
            Find games and venues near you
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          <View className="bg-navy-700 rounded-xl p-6 mb-4">
            <Text className="text-xl font-semibold text-teal mb-2">
              Welcome to P2P
            </Text>
            <Text className="text-navy-200">
              Discover sports games, book venues, and connect with players in your area.
            </Text>
          </View>

          <View className="bg-navy-700 rounded-xl p-6 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-2 rounded-full bg-gold mr-2" />
              <Text className="text-lg font-semibold text-white">
                Featured Games
              </Text>
            </View>
            <Text className="text-navy-300">
              Browse upcoming games and join the action
            </Text>
          </View>

          <View className="bg-navy-700 rounded-xl p-6 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="w-2 h-2 rounded-full bg-gold mr-2" />
              <Text className="text-lg font-semibold text-white">
                Popular Venues
              </Text>
            </View>
            <Text className="text-navy-300">
              Explore top-rated sports facilities
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
