import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  initialFilters: FilterState;
  onApply: (filters: FilterState) => void;
  defaultFilters: FilterState;
}

const TIME_SLOTS: { value: TimeSlot; label: string }[] = [
  { value: 'any', label: 'Any Time' },
  { value: '7-12', label: '7 AM - 12 PM' },
  { value: '12-5', label: '12 PM - 5 PM' },
  { value: '5-10', label: '5 PM - 10 PM' },
  { value: '10-2', label: '10 PM - 2 AM' },
];

const DIFFICULTIES: { value: Difficulty; label: string; color: string; bgColor: string }[] = [
  { value: 'beginner', label: 'Beginner', color: '#22c55e', bgColor: '#22c55e20' },
  { value: 'friendly', label: 'Friendly', color: '#84cc16', bgColor: '#84cc1620' },
  { value: 'intermediate', label: 'Intermediate', color: '#eab308', bgColor: '#eab30820' },
  { value: 'high-level', label: 'High-Level', color: '#f97316', bgColor: '#f9731620' },
  { value: 'masters', label: 'Masters', color: '#ef4444', bgColor: '#ef444420' },
];

const SORT_OPTIONS: { value: SortBy; label: string; icon: string }[] = [
  { value: 'distance', label: 'Distance', icon: 'navigate-outline' },
  { value: 'time', label: 'Time', icon: 'time-outline' },
];

export function FilterSheet({
  visible,
  onClose,
  initialFilters,
  onApply,
  defaultFilters,
}: FilterSheetProps) {
  const [draftFilters, setDraftFilters] = useState<FilterState>({ ...initialFilters });

  // Reset draft to initial filters when sheet opens or closes
  useEffect(() => {
    if (visible) {
      // Clone the initial filters when opening to avoid reference issues
      setDraftFilters({ 
        ...initialFilters, 
        difficulties: [...initialFilters.difficulties] 
      });
    } else {
      // Reset to initial filters when closing to ensure no draft state leaks
      setDraftFilters({ 
        ...initialFilters, 
        difficulties: [...initialFilters.difficulties] 
      });
    }
  }, [visible, initialFilters]);

  const toggleDifficulty = (difficulty: Difficulty) => {
    const newDifficulties = draftFilters.difficulties.includes(difficulty)
      ? draftFilters.difficulties.filter((d) => d !== difficulty)
      : [...draftFilters.difficulties, difficulty];
    setDraftFilters({ ...draftFilters, difficulties: newDifficulties });
  };

  const hasActiveFilters = () => {
    return (
      draftFilters.timeSlot !== 'any' ||
      draftFilters.distance < 100 ||
      draftFilters.difficulties.length > 0 ||
      draftFilters.sortBy !== 'distance'
    );
  };

  const handleApply = () => {
    // Clone the filters before applying to avoid reference issues
    onApply({
      ...draftFilters,
      difficulties: [...draftFilters.difficulties]
    });
  };

  const handleReset = () => {
    setDraftFilters({
      ...defaultFilters,
      difficulties: [...defaultFilters.difficulties]
    });
  };

  const handleClose = () => {
    // Just close - the useEffect will handle resetting
    onClose();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose} height={600}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-white">Filters</Text>
          <TouchableOpacity onPress={handleClose} data-testid="button-close-filters">
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
                    draftFilters.timeSlot === slot.value ? 'bg-teal' : 'bg-navy-600'
                  }`}
                  onPress={() => setDraftFilters({ ...draftFilters, timeSlot: slot.value })}
                  data-testid={`button-timeslot-${slot.value}`}
                >
                  <Text
                    className={`font-medium ${
                      draftFilters.timeSlot === slot.value ? 'text-white' : 'text-navy-300'
                    }`}
                  >
                    {slot.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Distance Selector */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-white font-semibold text-lg">Distance</Text>
              <Text className="text-teal font-bold text-lg">
                {draftFilters.distance === 100 ? '100+ km' : `${draftFilters.distance} km`}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {[5, 10, 20, 30, 50, 100].map((distance) => (
                <TouchableOpacity
                  key={distance}
                  className={`px-4 py-2 rounded-full ${
                    draftFilters.distance === distance ? 'bg-teal' : 'bg-navy-600'
                  }`}
                  onPress={() => setDraftFilters({ ...draftFilters, distance })}
                  data-testid={`button-distance-${distance}`}
                >
                  <Text
                    className={`font-medium ${
                      draftFilters.distance === distance ? 'text-white' : 'text-navy-300'
                    }`}
                  >
                    {distance === 100 ? '100+ km' : `${distance} km`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Difficulty Chips */}
          <View className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3">Difficulty Level</Text>
            <View className="flex-row flex-wrap gap-2">
              {DIFFICULTIES.map((diff) => {
                const isSelected = draftFilters.difficulties.includes(diff.value);
                return (
                  <TouchableOpacity
                    key={diff.value}
                    className="px-4 py-2.5 rounded-full"
                    style={{
                      backgroundColor: isSelected ? diff.color : diff.bgColor,
                      borderWidth: 2,
                      borderColor: isSelected ? diff.color : 'transparent',
                    }}
                    onPress={() => toggleDifficulty(diff.value)}
                    data-testid={`button-difficulty-${diff.value}`}
                  >
                    <Text
                      className="font-bold"
                      style={{
                        color: isSelected ? '#fff' : diff.color,
                      }}
                    >
                      {diff.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
                    draftFilters.sortBy === option.value ? 'bg-teal' : 'bg-navy-600'
                  }`}
                  onPress={() => setDraftFilters({ ...draftFilters, sortBy: option.value })}
                  data-testid={`button-sort-${option.value}`}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={18}
                    color={draftFilters.sortBy === option.value ? '#fff' : '#8dabc9'}
                  />
                  <Text
                    className={`ml-2 font-semibold ${
                      draftFilters.sortBy === option.value ? 'text-white' : 'text-navy-300'
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
              onPress={handleReset}
              data-testid="button-reset-filters"
            >
              <Text className="text-white font-semibold text-center">Reset</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className={`py-4 rounded-xl bg-teal ${hasActiveFilters() ? 'flex-1' : 'flex-1'}`}
            onPress={handleApply}
            data-testid="button-apply-filters"
          >
            <Text className="text-white font-bold text-center">Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
}
