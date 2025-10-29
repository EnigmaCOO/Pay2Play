import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MessagesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">
            Messages
          </Text>
          <Text className="text-navy-300 mt-1">
            Chat with your teammates
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          <View className="bg-navy-700 rounded-xl p-4 mb-3 border-l-4 border-teal">
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-full bg-teal items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg">AK</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-white font-semibold text-base">
                    Ahmed Khan
                  </Text>
                  <Text className="text-navy-400 text-xs">
                    2m ago
                  </Text>
                </View>
                <Text className="text-navy-300 text-sm">
                  Hey! Are you coming to the game tomorrow?
                </Text>
                <View className="bg-teal w-5 h-5 rounded-full items-center justify-center mt-2">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-full bg-gold items-center justify-center mr-3">
                <Text className="text-navy-900 font-bold text-lg">FC</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-white font-semibold text-base">
                    Friday Cricket Team
                  </Text>
                  <Text className="text-navy-400 text-xs">
                    1h ago
                  </Text>
                </View>
                <Text className="text-navy-300 text-sm">
                  Great game everyone! Same time next week?
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-4 mb-3">
            <View className="flex-row items-start">
              <View className="w-12 h-12 rounded-full bg-navy-600 items-center justify-center mr-3">
                <Text className="text-navy-300 font-bold text-lg">SM</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-start mb-1">
                  <Text className="text-white font-semibold text-base">
                    Sara Malik
                  </Text>
                  <Text className="text-navy-400 text-xs">
                    Yesterday
                  </Text>
                </View>
                <Text className="text-navy-400 text-sm">
                  Thanks for the invite! See you there.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
