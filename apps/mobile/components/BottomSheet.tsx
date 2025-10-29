import { Modal, View, TouchableOpacity, TouchableWithoutFeedback, Animated, Dimensions } from 'react-native';
import { useEffect, useRef } from 'react';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: number;
}

export function BottomSheet({ visible, onClose, children, height = 500 }: BottomSheetProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, opacityAnim, height]);

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          className="flex-1 justify-end bg-black/50"
          style={{ opacity: opacityAnim }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              className="bg-navy-700 rounded-t-3xl"
              style={{
                transform: [{ translateY: slideAnim }],
                height,
              }}
            >
              {/* Handle Bar */}
              <View className="items-center pt-3 pb-2">
                <View className="w-12 h-1 bg-navy-500 rounded-full" />
              </View>
              
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
