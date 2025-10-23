import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">
            Bookings
          </Text>
          <Text className="text-navy-300 mt-1">
            Manage your reservations
          </Text>
        </View>

        <ScrollView className="flex-1 px-6 py-4">
          <View className="bg-navy-700 rounded-xl p-6 mb-4 border-l-4 border-teal">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-semibold text-white">
                Upcoming Booking
              </Text>
              <View className="bg-teal px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  CONFIRMED
                </Text>
              </View>
            </View>
            <Text className="text-navy-300 mb-1">
              Cricket Ground A
            </Text>
            <Text className="text-navy-400 text-sm">
              Tomorrow, 6:00 PM - 8:00 PM
            </Text>
            <View className="mt-3 pt-3 border-t border-navy-600">
              <Text className="text-gold font-semibold">
                PKR 2,000
              </Text>
            </View>
          </View>

          <View className="bg-navy-700 rounded-xl p-6 mb-4 border-l-4 border-navy-600">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-lg font-semibold text-white">
                Past Booking
              </Text>
              <View className="bg-navy-600 px-3 py-1 rounded-full">
                <Text className="text-navy-300 text-xs font-semibold">
                  COMPLETED
                </Text>
              </View>
            </View>
            <Text className="text-navy-300 mb-1">
              Football Field B
            </Text>
            <Text className="text-navy-400 text-sm">
              Last week, 5:00 PM - 7:00 PM
            </Text>
            <View className="mt-3 pt-3 border-t border-navy-600">
              <Text className="text-navy-400 font-semibold">
                PKR 1,500
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
