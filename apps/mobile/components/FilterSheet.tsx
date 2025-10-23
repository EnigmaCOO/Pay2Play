import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { BottomSheet } from './BottomSheet';

export type TimeSlot = '7-12' | '12-5' | '5-10' | '10-2' | 'any';
export type Difficulty = 'beginner' | 'friendly' | 'intermediate' | 'high-level' | 'masters';
export type SortBy = 'distance' | 'time';

export interface FilterState {
  timeSlot: TimeSlot;
  distance: number;
  difficulties: Difficulty[];
  sortBy: SortBy;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
  onReset: () => void;
}

const TIME_SLOTS: { value: TimeSlot; label: string }[] = [
  { value: 'any', label: 'Any Time' },
  { value: '7-12', label: '7 AM - 12 PM' },
  { value: '12-5', label: '12 PM - 5 PM' },
  { value: '5-10', label: '5 PM - 10 PM' },
  { value: '10-2', label: '10 PM - 2 AM' },
];

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'high-level', label: 'High-Level' },
  { value: 'masters', label: 'Masters' },
];

const SORT_OPTIONS: { value: SortBy; label: string; icon: string }[] = [
  { value: 'distance', label: 'Distance', icon: 'navigate-outline' },
  { value: 'time', label: 'Time', icon: 'time-outline' },
];

export function FilterSheet({
  visible,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset,
}: FilterSheetProps) {
  const toggleDifficulty = (difficulty: Difficulty) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter((d) => d !== difficulty)
      : [...filters.difficulties, difficulty];
    onFiltersChange({ ...filters, difficulties: newDifficulties });
  };

  const hasActiveFilters = () => {
    return (
      filters.timeSlot !== 'any' ||
      filters.distance < 100 ||
      filters.difficulties.length > 0 ||
      filters.sortBy !== 'distance'
    );
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} height={600}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-white">Filters</Text>
          <TouchableOpacity onPress={onClose} data-testid="button-close-filters">
            <Ionicons name="close" size={24} color="#8dabc9" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Time Slots */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3">Preferred Time</Text>
            <View className="flex-row flex-wrap gap-2">
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot.value}
                  className={`px-4 py-2 rounded-full ${
                    filters.timeSlot === slot.value ? 'bg-teal' : 'bg-navy-600'
                  }`}
                  onPress={() => onFiltersChange({ ...filters, timeSlot: slot.value })}
                  data-testid={`button-timeslot-${slot.value}`}
                >
                  <Text
                    className={`font-medium ${
                      filters.timeSlot === slot.value ? 'text-white' : 'text-navy-300'
                    }`}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance Slider */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white font-semibold text-lg">Distance</Text>
              <Text className="text-teal font-bold text-lg">
                {filters.distance === 100 ? '100+ km' : `${filters.distance} km`}
              </Text>
            </View>
            <Slider
              minimumValue={0}
              maximumValue={100}
              step={5}
              value={filters.distance}
              onValueChange={(value: number) => onFiltersChange({ ...filters, distance: value })}
              minimumTrackTintColor="#14b8a6"
              maximumTrackTintColor="#1e3a5f"
              thumbTintColor="#14b8a6"
              data-testid="slider-distance"
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-navy-400 text-xs">0 km</Text>
              <Text className="text-navy-400 text-xs">100+ km</Text>
            </View>
          </View>

          {/* Difficulty Chips */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3">Difficulty Level</Text>
            <View className="flex-row flex-wrap gap-2">
              {DIFFICULTIES.map((diff) => (
                <TouchableOpacity
                  key={diff.value}
                  className={`px-4 py-2 rounded-full ${
                    filters.difficulties.includes(diff.value) ? 'bg-teal' : 'bg-navy-600'
                  }`}
                  onPress={() => toggleDifficulty(diff.value)}
                  data-testid={`button-difficulty-${diff.value}`}
                >
                  <Text
                    className={`font-medium ${
                      filters.difficulties.includes(diff.value) ? 'text-white' : 'text-navy-300'
                    }`}
                  >
                    {diff.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Sort By */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3">Sort By</Text>
            <View className="flex-row gap-3">
              {SORT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={`flex-1 flex-row items-center justify-center px-4 py-3 rounded-xl ${
                    filters.sortBy === option.value ? 'bg-teal' : 'bg-navy-600'
                  }`}
                  onPress={() => onFiltersChange({ ...filters, sortBy: option.value })}
                  data-testid={`button-sort-${option.value}`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={filters.sortBy === option.value ? '#fff' : '#8dabc9'}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      filters.sortBy === option.value ? 'text-white' : 'text-navy-300'
                    }`}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View className="flex-row gap-3 pb-6 pt-4 border-t border-navy-600">
          {hasActiveFilters() && (
            <TouchableOpacity
              className="flex-1 py-4 rounded-xl bg-navy-600"
              onPress={onReset}
              data-testid="button-reset-filters"
            >
              <Text className="text-white font-semibold text-center">Reset</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`py-4 rounded-xl bg-teal ${hasActiveFilters() ? 'flex-1' : 'flex-1'}`}
            onPress={onApply}
            data-testid="button-apply-filters"
          >
            <Text className="text-white font-bold text-center">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
