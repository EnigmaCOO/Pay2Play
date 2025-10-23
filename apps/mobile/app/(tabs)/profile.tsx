import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
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
            <View className="w-24 h-24 rounded-full bg-gradient-to-br from-teal to-gold items-center justify-center mb-4">
              <Text className="text-white font-bold text-3xl">JD</Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              John Doe
            </Text>
            <Text className="text-navy-300">
              john.doe@example.com
            </Text>
            <View className="flex-row mt-3">
              <View className="bg-navy-700 px-4 py-2 rounded-full mr-2">
                <Text className="text-teal font-semibold">
                  15 Games Played
                </Text>
              </View>
              <View className="bg-navy-700 px-4 py-2 rounded-full">
                <Text className="text-gold font-semibold">
                  Level 5
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <Text className="text-white font-semibold text-base mb-1">
              Favorite Sports
            </Text>
            <View className="flex-row flex-wrap mt-2">
              <View className="bg-teal px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-white text-sm">Cricket</Text>
              </View>
              <View className="bg-teal px-3 py-1 rounded-full mr-2 mb-2">
                <Text className="text-white text-sm">Football</Text>
              </View>
              <View className="bg-navy-600 px-3 py-1 rounded-full mb-2">
                <Text className="text-navy-300 text-sm">+ Add Sport</Text>
              </View>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <Text className="text-white font-semibold text-base mb-3">
              Settings
            </Text>
            <View className="space-y-3">
              <View className="py-2">
                <Text className="text-navy-200">Edit Profile</Text>
              </View>
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
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <Text className="text-red-400 font-semibold text-center">
              Sign Out
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
