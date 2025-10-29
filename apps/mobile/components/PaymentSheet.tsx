import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from './BottomSheet';

interface PaymentSheetProps {
  visible: boolean;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentSheet({ visible, amount, onSuccess, onCancel }: PaymentSheetProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setIsProcessing(false);
      setPaymentSuccess(false);
    }
  }, [visible]);

  const handleMockPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentSuccess(true);
    
    // Auto-close after showing success
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <BottomSheet visible={visible} onClose={onCancel} height={400}>
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-white">Payment</Text>
          {!isProcessing && !paymentSuccess && (
            <TouchableOpacity onPress={onCancel} data-testid="button-close-payment">
              <Ionicons name="close" size={24} color="#8dabc9" />
            </TouchableOpacity>
          )}
        </View>

        {paymentSuccess ? (
          /* Success State */
          <View className="flex-1 items-center justify-center">
            <View className="w-20 h-20 rounded-full bg-teal/20 items-center justify-center mb-4">
              <Ionicons name="checkmark-circle" size={64} color="#14b8a6" />
            </View>
            <Text className="text-white text-2xl font-bold mb-2">Payment Successful!</Text>
            <Text className="text-navy-300 text-center">
              You're all set. See you at the game!
            </Text>
          </View>
        ) : (
          /* Payment Form */
          <View className="flex-1">
            {/* Mock Provider Badge */}
            <View className="bg-gold/10 border border-gold/30 rounded-lg p-3 mb-6">
              <View className="flex-row items-center">
                <Ionicons name="information-circle" size={20} color="#fbbf24" />
                <Text className="text-gold text-sm ml-2 flex-1">
                  Mock Payment Provider (Development Mode)
                </Text>
              </View>
            </View>

            {/* Amount Display */}
            <View className="bg-navy-700 rounded-xl p-4 mb-6">
              <Text className="text-navy-400 text-sm mb-1">Amount to Pay</Text>
              <Text className="text-white text-3xl font-bold">PKR {amount}</Text>
            </View>

            {/* Mock Payment Details */}
            <View className="mb-6">
              <Text className="text-white font-semibold mb-3">Payment Method</Text>
              
              <View className="bg-navy-700 rounded-xl p-4 flex-row items-center">
                <View className="w-12 h-12 rounded-lg bg-teal/20 items-center justify-center mr-3">
                  <Ionicons name="card" size={24} color="#14b8a6" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Mock Credit Card</Text>
                  <Text className="text-navy-400 text-sm">•••• •••• •••• 4242</Text>
                </View>
                <Ionicons name="checkmark-circle" size={24} color="#14b8a6" />
              </View>
            </View>

            {/* Info */}
            <View className="bg-navy-700 rounded-lg p-3 mb-6">
              <Text className="text-navy-300 text-xs">
                This is a simulated payment for development purposes. 
                No real transaction will be processed.
              </Text>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              className="bg-teal rounded-xl py-4 items-center"
              onPress={handleMockPayment}
              disabled={isProcessing}
              data-testid="button-confirm-payment"
            >
              {isProcessing ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="#fff" size="small" />
                  <Text className="text-white font-bold ml-2">Processing...</Text>
                </View>
              ) : (
                <Text className="text-white text-lg font-bold">
                  Pay PKR {amount}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BottomSheet>
  );
}
