import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FriendsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">
            Friends
          </Text>
          <Text className="text-navy-300 mt-1">
            Connect with your teammates
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-teal items-center justify-center mr-4">
                <Text className="text-white font-bold text-lg">AK</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  Ahmed Khan
                </Text>
                <View className="flex-row items-center mt-1">
                  <View className="w-2 h-2 rounded-full bg-teal mr-2" />
                  <Text className="text-navy-300 text-sm">
                    Active now
                  </Text>
                </View>
              </View>
              <View className="bg-navy-600 px-3 py-1 rounded-full">
                <Text className="text-teal text-xs font-semibold">
                  FRIEND
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-gold items-center justify-center mr-4">
                <Text className="text-navy-900 font-bold text-lg">SM</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  Sara Malik
                </Text>
                <Text className="text-navy-400 text-sm mt-1">
                  Last seen 2 hours ago
                </Text>
              </View>
              <View className="bg-navy-600 px-3 py-1 rounded-full">
                <Text className="text-teal text-xs font-semibold">
                  FRIEND
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <View className="flex-row items-center">
              <View className="w-12 h-12 rounded-full bg-navy-600 items-center justify-center mr-4">
                <Text className="text-navy-300 font-bold text-lg">ZH</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold text-base">
                  Zain Hassan
                </Text>
                <Text className="text-navy-400 text-sm mt-1">
                  Offline
                </Text>
              </View>
              <View className="bg-navy-600 px-3 py-1 rounded-full">
                <Text className="text-teal text-xs font-semibold">
                  FRIEND
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
