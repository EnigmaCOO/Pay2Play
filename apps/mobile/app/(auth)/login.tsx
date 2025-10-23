import { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';

type AuthMode = 'email' | 'phone';
type AuthAction = 'signin' | 'signup';

export default function LoginScreen() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail, verifyPhoneNumber, confirmPhoneCode } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('email');
  const [action, setAction] = useState<AuthAction>('signin');
  const [loading, setLoading] = useState(false);
  
  // Email fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Phone fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  
  const recaptchaVerifier = useRef(null);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      if (action === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    setLoading(true);
    try {
      const verificationId = await verifyPhoneNumber(phoneNumber, recaptchaVerifier.current);
      setVerificationId(verificationId);
      setCodeSent(true);
      Alert.alert('Success', 'OTP sent to your phone');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setLoading(true);
    try {
      await confirmPhoneCode(verificationId, verificationCode);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-navy-800">
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={auth.app.options}
        attemptInvisibleVerification={true}
      />
      
      <ScrollView className="flex-1 px-6 py-8">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white mb-2">
            Welcome to P2P
          </Text>
          <Text className="text-navy-300 text-lg">
            Sign in to continue
          </Text>
        </View>

        <View className="flex-row mb-6 bg-navy-700 rounded-xl p-1">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${mode === 'email' ? 'bg-teal' : ''}`}
            onPress={() => setMode('email')}
            data-testid="button-email-mode"
          >
            <Text className={`text-center font-semibold ${mode === 'email' ? 'text-white' : 'text-navy-300'}`}>
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg ${mode === 'phone' ? 'bg-teal' : ''}`}
            onPress={() => setMode('phone')}
            data-testid="button-phone-mode"
          >
            <Text className={`text-center font-semibold ${mode === 'phone' ? 'text-white' : 'text-navy-300'}`}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'email' ? (
          <View>
            <View className="mb-4">
              <Text className="text-navy-200 mb-2 font-medium">Email</Text>
              <TextInput
                className="bg-navy-700 text-white px-4 py-3 rounded-xl"
                placeholder="Enter your email"
                placeholderTextColor="#8dabc9"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                data-testid="input-email"
              />
            </View>

            <View className="mb-6">
              <Text className="text-navy-200 mb-2 font-medium">Password</Text>
              <TextInput
                className="bg-navy-700 text-white px-4 py-3 rounded-xl"
                placeholder="Enter your password"
                placeholderTextColor="#8dabc9"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                data-testid="input-password"
              />
            </View>

            <TouchableOpacity
              className={`bg-teal py-4 rounded-xl mb-4 ${loading ? 'opacity-50' : ''}`}
              onPress={handleEmailAuth}
              disabled={loading}
              data-testid="button-email-auth"
            >
              <Text className="text-white text-center font-bold text-lg">
                {loading ? 'Loading...' : action === 'signin' ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAction(action === 'signin' ? 'signup' : 'signin')}
              data-testid="button-toggle-action"
            >
              <Text className="text-teal text-center">
                {action === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            {!codeSent ? (
              <>
                <View className="mb-6">
                  <Text className="text-navy-200 mb-2 font-medium">Phone Number</Text>
                  <TextInput
                    className="bg-navy-700 text-white px-4 py-3 rounded-xl"
                    placeholder="+1 999 999 9999"
                    placeholderTextColor="#8dabc9"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    data-testid="input-phone"
                  />
                  <Text className="text-navy-400 text-sm mt-2">
                    Include country code (e.g., +1 for US)
                  </Text>
                </View>

                <TouchableOpacity
                  className={`bg-teal py-4 rounded-xl ${loading ? 'opacity-50' : ''}`}
                  onPress={handleSendOTP}
                  disabled={loading}
                  data-testid="button-send-otp"
                >
                  <Text className="text-white text-center font-bold text-lg">
                    {loading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="mb-6">
                  <Text className="text-navy-200 mb-2 font-medium">Verification Code</Text>
                  <TextInput
                    className="bg-navy-700 text-white px-4 py-3 rounded-xl text-center text-2xl tracking-widest"
                    placeholder="000000"
                    placeholderTextColor="#8dabc9"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                    maxLength={6}
                    data-testid="input-otp-code"
                  />
                  <Text className="text-navy-400 text-sm mt-2 text-center">
                    Enter the 6-digit code sent to {phoneNumber}
                  </Text>
                </View>

                <TouchableOpacity
                  className={`bg-teal py-4 rounded-xl mb-4 ${loading ? 'opacity-50' : ''}`}
                  onPress={handleVerifyOTP}
                  disabled={loading}
                  data-testid="button-verify-otp"
                >
                  <Text className="text-white text-center font-bold text-lg">
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setCodeSent(false);
                    setVerificationCode('');
                  }}
                  data-testid="button-back-phone"
                >
                  <Text className="text-teal text-center">
                    Change phone number
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}

        <View className="mt-8 p-4 bg-navy-700 rounded-xl">
          <Text className="text-navy-300 text-sm text-center">
            By continuing, you agree to P2P's Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
