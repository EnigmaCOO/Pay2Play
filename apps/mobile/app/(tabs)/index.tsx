import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '@/lib/api';
import { GameCard } from '@/components/GameCard';
import { FilterSheet, type FilterState } from '@/components/FilterSheet';

type Sport = 'all' | 'football' | 'cricket' | 'padel';

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
    };
  };
};

const SPORTS: { value: Sport; label: string; icon: string }[] = [
  { value: 'all', label: 'All', icon: 'apps' },
  { value: 'football', label: 'Football', icon: 'football' },
  { value: 'cricket', label: 'Cricket', icon: 'baseball' },
  { value: 'padel', label: 'Padel', icon: 'tennisball' },
];

const FILTER_STORAGE_KEY = '@p2p_discover_filters';
const ADVANCED_FILTER_STORAGE_KEY = '@p2p_discover_advanced_filters';

const DEFAULT_FILTERS: FilterState = {
  timeSlot: 'any',
  distance: 100,
  difficulties: [],
  sortBy: 'distance',
};

export default function DiscoverScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSport, setSelectedSport] = useState<Sport>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [advancedFilters, setAdvancedFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Load saved filters from AsyncStorage
  useEffect(() => {
    loadSavedFilters();
    generateDates();
  }, []);

  // Save filters to AsyncStorage whenever they change
  useEffect(() => {
    saveFilters();
  }, [selectedSport, searchQuery]);

  // Save advanced filters to AsyncStorage whenever they change
  useEffect(() => {
    saveAdvancedFilters();
  }, [advancedFilters]);

  const loadSavedFilters = async () => {
    try {
      const saved = await AsyncStorage.getItem(FILTER_STORAGE_KEY);
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.sport) setSelectedSport(filters.sport);
        if (filters.searchQuery) setSearchQuery(filters.searchQuery);
      }

      const savedAdvanced = await AsyncStorage.getItem(ADVANCED_FILTER_STORAGE_KEY);
      if (savedAdvanced) {
        const filters = JSON.parse(savedAdvanced);
        setAdvancedFilters(filters);
      }
    } catch (error) {
      console.error('Failed to load filters:', error);
    }
  };

  const saveFilters = async () => {
    try {
      await AsyncStorage.setItem(
        FILTER_STORAGE_KEY,
        JSON.stringify({ sport: selectedSport, searchQuery })
      );
    } catch (error) {
      console.error('Failed to save filters:', error);
    }
  };

  const saveAdvancedFilters = async () => {
    try {
      await AsyncStorage.setItem(
        ADVANCED_FILTER_STORAGE_KEY,
        JSON.stringify(advancedFilters)
      );
    } catch (error) {
      console.error('Failed to save advanced filters:', error);
    }
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    refetch();
  };

  const handleResetFilters = () => {
    setAdvancedFilters(DEFAULT_FILTERS);
  };

  const generateDates = () => {
    const dateArray: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dateArray.push(date);
    }
    setDates(dateArray);
  };

  const { data: games = [], isLoading, refetch, isFetching } = useQuery<GameWithDetails[]>({
    queryKey: [
      '/api/games/search', 
      selectedSport, 
      selectedDate.toDateString(),
      advancedFilters.timeSlot,
      advancedFilters.distance,
      advancedFilters.difficulties,
      advancedFilters.sortBy,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedSport !== 'all') {
        params.append('sport', selectedSport);
      }
      // Note: Backend currently only supports sport filter
      // Future: Add these filter params when backend supports them:
      // if (advancedFilters.timeSlot !== 'any') params.append('timeSlot', advancedFilters.timeSlot);
      // if (advancedFilters.distance < 100) params.append('distance', advancedFilters.distance.toString());
      // if (advancedFilters.difficulties.length) params.append('difficulties', advancedFilters.difficulties.join(','));
      // params.append('sortBy', advancedFilters.sortBy);
      
      const response = await apiClient.get(`/api/games/search?${params.toString()}`);
      return response.data;
    },
  });

  // Filter games by selected date and search query (client-side until backend supports these params)
  const filteredGames = games.filter((game) => {
    const gameDate = new Date(game.startTime);
    const isSameDay =
      gameDate.getDate() === selectedDate.getDate() &&
      gameDate.getMonth() === selectedDate.getMonth() &&
      gameDate.getFullYear() === selectedDate.getFullYear();

    const matchesSearch =
      !searchQuery ||
      game.field.venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.field.venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.sport.toLowerCase().includes(searchQuery.toLowerCase());

    return isSameDay && matchesSearch;
  });

  const formatDatePill = (date: Date) => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) return 'Today';

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow =
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth() &&
      date.getFullYear() === tomorrow.getFullYear();

    if (isTomorrow) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateSubtext = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isDateSelected = (date: Date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <View className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 border-b border-navy-700">
          <Text className="text-3xl font-bold text-white">Discover</Text>
          <Text className="text-navy-300 mt-1">Find games near you</Text>
        </View>

        {/* Search Bar */}
        <View className="px-6 py-4">
          <View className="flex-row items-center bg-navy-700 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#8dabc9" />
            <TextInput
              className="flex-1 text-white ml-3"
              placeholder="Search venues, locations..."
              placeholderTextColor="#8dabc9"
              value={searchQuery}
              onChangeText={setSearchQuery}
              data-testid="input-search"
            />
            <TouchableOpacity
              onPress={() => setShowFilters(!showFilters)}
              data-testid="button-filter"
            >
              <Ionicons name="filter" size={20} color="#14b8a6" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Pills */}
        <View className="px-6 pb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            data-testid="scroll-date-pills"
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                className={`mr-3 px-4 py-3 rounded-xl ${
                  isDateSelected(date) ? 'bg-teal' : 'bg-navy-700'
                }`}
                onPress={() => setSelectedDate(date)}
                data-testid={`pill-date-${index}`}
              >
                <Text
                  className={`font-semibold text-center ${
                    isDateSelected(date) ? 'text-white' : 'text-navy-300'
                  }`}
                >
                  {formatDatePill(date)}
                </Text>
                <Text
                  className={`text-xs text-center mt-1 ${
                    isDateSelected(date) ? 'text-white/80' : 'text-navy-400'
                  }`}
                >
                  {formatDateSubtext(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sport Selector */}
        <View className="px-6 pb-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-row"
            data-testid="scroll-sport-selector"
          >
            {SPORTS.map((sport) => (
              <TouchableOpacity
                key={sport.value}
                className={`mr-3 px-4 py-2 rounded-full flex-row items-center ${
                  selectedSport === sport.value ? 'bg-teal' : 'bg-navy-700'
                }`}
                onPress={() => setSelectedSport(sport.value)}
                data-testid={`button-sport-${sport.value}`}
              >
                <Ionicons
                  name={sport.icon as any}
                  size={16}
                  color={selectedSport === sport.value ? '#fff' : '#8dabc9'}
                />
                <Text
                  className={`ml-2 font-semibold ${
                    selectedSport === sport.value ? 'text-white' : 'text-navy-300'
                  }`}
                >
                  {sport.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Games List */}
        <ScrollView
          className="flex-1 px-6"
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor="#14b8a6"
            />
          }
          data-testid="scroll-games-list"
        >
          {isLoading ? (
            <View className="py-12">
              <Text className="text-navy-400 text-center">Loading games...</Text>
            </View>
          ) : filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))
          ) : (
            <View className="bg-navy-700 rounded-xl p-8 items-center" data-testid="empty-state">
              <View className="w-20 h-20 rounded-full bg-navy-600 items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={32} color="#8dabc9" />
              </View>
              <Text className="text-white text-xl font-bold mb-2">
                No games found
              </Text>
              <Text className="text-navy-300 text-center mb-4">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : `No ${selectedSport === 'all' ? '' : selectedSport + ' '}games on ${formatDatePill(selectedDate)}`}
              </Text>
              <TouchableOpacity
                className="bg-teal px-6 py-3 rounded-xl"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedSport('all');
                  setSelectedDate(new Date());
                }}
                data-testid="button-clear-filters"
              >
                <Text className="text-white font-semibold">Clear Filters</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Filter Bottom Sheet */}
      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
    </SafeAreaView>
  );
}
