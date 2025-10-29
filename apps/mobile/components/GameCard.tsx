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
      className="bg-navy-700 rounded-2xl p-5 mb-3 border border-navy-600/50 active:scale-[0.98]"
      style={{
        shadowColor: sportColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }}
      onPress={() => router.push(`/game/${game.id}` as any)}
      data-testid={`card-game-${game.id}`}
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <View 
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{ 
              backgroundColor: sportColor + '20',
              borderWidth: 1.5,
              borderColor: sportColor + '40',
            }}
          >
            <Ionicons 
              name={sportIcons[game.sport] as any} 
              size={22} 
              color={sportColor} 
            />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg capitalize">
              {game.sport}
            </Text>
            <Text className="text-navy-300 text-sm">
              {game.field.venue.name}
            </Text>
          </View>
        </View>
        <View 
          className={`px-3 py-1.5 rounded-full ${isFilling ? 'bg-teal/20' : 'bg-navy-600'}`}
          style={{
            borderWidth: 1,
            borderColor: isFilling ? '#14b8a620' : '#1e293b',
          }}
        >
          <Text className={`text-xs font-bold ${isFilling ? 'text-teal' : 'text-navy-300'}`}>
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
