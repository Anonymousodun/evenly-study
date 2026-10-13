import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image, Easing } from 'react-native';
import AppText from '../components/common/Text';

// Dark launch splash: the logo pops in, name and tagline rise below it,
// then hands off to Welcome after ~2.2s. Timers are cleaned up on unmount.
export function SplashScreen({ navigation }: any) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 5,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(textOpacity, {
            toValue: 1,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(textSlide, {
            toValue: 0,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2200);
    return () => clearTimeout(timer);
  }, [logoScale, logoOpacity, textOpacity, textSlide, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Image
          source={require('../../assets/android-icon-foreground.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textSlide }], alignItems: 'center' }}>
        <AppText variant="display" style={styles.title}>Evenly Study</AppText>
        <AppText variant="bodySmall" style={styles.tagline}>
          Keep going without falling apart
        </AppText>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1520',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tagline: {
    color: '#9AB4C8',
    textAlign: 'center',
    marginTop: 8,
  },
});
