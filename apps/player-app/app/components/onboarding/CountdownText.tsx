import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

interface CountdownTextProps {
  initialSeconds?: number;
  onComplete?: () => void;
}

const CountdownText = ({ initialSeconds = 60, onComplete }: CountdownTextProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [seconds, onComplete]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Text style={styles.countdown}>
      {seconds > 0 ? `Resend code in ${formatTime(seconds)}` : 'Resend code'}
    </Text>
  );
};

const styles = StyleSheet.create({
  countdown: {
    color: '#14b8a6',
    fontWeight: 'bold',
  }
});

export default CountdownText;
