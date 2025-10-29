import { View, Animated, DimensionValue } from 'react-native';
import { useEffect, useRef } from 'react';

export function SkeletonBox({ width, height, className }: { width: DimensionValue; height: number; className?: string }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className={`bg-navy-700 rounded-lg ${className || ''}`}
    >
      <View style={{ width, height }} />
    </Animated.View>
  );
}

export function GameCardSkeleton() {
  return (
    <View className="bg-navy-800 rounded-2xl p-4 mb-3 border border-navy-700">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <SkeletonBox width="60%" height={20} className="mb-2" />
          <SkeletonBox width="40%" height={16} />
        </View>
        <SkeletonBox width={60} height={28} />
      </View>
      
      <View className="flex-row items-center mb-3">
        <SkeletonBox width={24} height={24} className="rounded-full mr-2" />
        <SkeletonBox width="50%" height={16} />
      </View>
      
      <View className="flex-row justify-between items-center pt-3 border-t border-navy-700">
        <View className="flex-row items-center gap-4">
          <SkeletonBox width={60} height={16} />
          <SkeletonBox width={80} height={16} />
        </View>
        <SkeletonBox width={80} height={20} />
      </View>
    </View>
  );
}

export function ProfileStatsSkeleton() {
  return (
    <View className="flex-row justify-around py-6 border-y border-navy-700">
      {[1, 2, 3].map((i) => (
        <View key={i} className="items-center">
          <SkeletonBox width={40} height={24} className="mb-1" />
          <SkeletonBox width={60} height={14} />
        </View>
      ))}
    </View>
  );
}

export function BookingCardSkeleton() {
  return (
    <View className="bg-navy-800 rounded-2xl p-4 mb-3 border border-navy-700">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <SkeletonBox width="70%" height={20} className="mb-2" />
          <SkeletonBox width="50%" height={16} />
        </View>
        <SkeletonBox width={70} height={24} />
      </View>
      
      <View className="flex-row items-center gap-4 mb-2">
        <SkeletonBox width={24} height={24} className="rounded-full" />
        <SkeletonBox width="40%" height={16} />
      </View>
      
      <View className="flex-row justify-between items-center pt-3 border-t border-navy-700">
        <SkeletonBox width={100} height={16} />
        <SkeletonBox width={80} height={20} />
      </View>
    </View>
  );
}
