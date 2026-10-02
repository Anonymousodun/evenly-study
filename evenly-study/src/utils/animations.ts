import { Animated } from 'react-native';

export function useFadeIn(duration: number = 300) {
  const opacity = new Animated.Value(0);

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return { opacity, fadeIn };
}

export function useScaleIn(duration: number = 200) {
  const scale = new Animated.Value(0.95);

  const scaleIn = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return { scale, scaleIn };
}

export function useSlideUp(duration: number = 300) {
  const translateY = new Animated.Value(20);
  const opacity = new Animated.Value(0);

  const slideUp = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { translateY, opacity, slideUp };
}

export function useColorTransition(
  fromColor: string,
  toColor: string,
  duration: number = 500
) {
  const color = new Animated.Value(0);

  const transition = () => {
    Animated.timing(color, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();
  };

  const backgroundColor = color.interpolate({
    inputRange: [0, 1],
    outputRange: [fromColor, toColor],
  });

  return { backgroundColor, transition };
}
