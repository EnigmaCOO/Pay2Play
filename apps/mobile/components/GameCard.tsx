import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type GameWithDetails = {
  id: string;
  sport: string;
  startTime: string;
  endTime: string;
  pricePerPlayerPkr: number;
  currentPlayers: number;
  maxPlayers: number;
  minPlayers: number;
  status: string;
  field: {
    name: string;
    venue: {
      name: string;
      city: string;
    };
  };
};

interface GameCardProps {
  game: GameWithDetails;
}

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

export function GameCard({ game }: GameCardProps) {
  const router = useRouter();
  const sportColor = sportColors[game.sport] || '#14b8a6';
  const spotsLeft = game.maxPlayers - game.currentPlayers;
  const isFilling = game.currentPlayers >= game.minPlayers;

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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity
      className="bg-navy-700 rounded-xl p-4 mb-3"
      onPress={() => router.push(`/game/${game.id}` as any)}
      data-testid={`card-game-${game.id}`}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: sportColor + '20' }}
          >
            <Ionicons 
              name={sportIcons[game.sport] as any} 
              size={20} 
              color={sportColor} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold text-lg capitalize">
              {game.sport}
            </Text>
            <Text className="text-navy-300 text-sm">
              {game.field.venue.name}
            </Text>
          </View>
        </View>
        <View className={`px-3 py-1 rounded-full ${isFilling ? 'bg-teal/20' : 'bg-navy-600'}`}>
          <Text className={`text-xs font-semibold ${isFilling ? 'text-teal' : 'text-navy-300'}`}>
            {game.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="flex-row items-center mb-3">
        <Ionicons name="calendar-outline" size={16} color="#8dabc9" />
        <Text className="text-navy-300 text-sm ml-2">
          {formatDate(game.startTime)} • {formatTime(game.startTime)} - {formatTime(game.endTime)}
        </Text>
      </View>

      <View className="flex-row items-center mb-3">
        <Ionicons name="location-outline" size={16} color="#8dabc9" />
        <Text className="text-navy-300 text-sm ml-2">
          {game.field.name} • {game.field.venue.city}
        </Text>
      </View>

      <View className="flex-row items-center justify-between pt-3 border-t border-navy-600">
        <View className="flex-row items-center">
          <Ionicons name="people-outline" size={18} color="#14b8a6" />
          <Text className="text-white ml-2 font-medium">
            {game.currentPlayers}/{game.maxPlayers} players
          </Text>
          {spotsLeft > 0 && spotsLeft <= 3 && (
            <Text className="text-gold text-xs ml-2">
              ({spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left!)
            </Text>
          )}
        </View>
        <Text className="text-teal font-bold text-lg">
          PKR {game.pricePerPlayerPkr}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
