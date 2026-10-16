import React from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';
import { Button } from '../common/Button';
import { useTour, Spot } from './TourContext';

function toLocal(spot: Spot, container: Spot): Spot {
  return { x: spot.x - container.x, y: spot.y - container.y, width: spot.width, height: spot.height };
}

// Custom dim + spotlight + bubble. No library, no native code.
// The full-screen dim ignores touches so Support and helplines stay
// reachable; only the tab-bar strip swallows touches, and Skip is
// always visible and working.
export function TourOverlay() {
  const tour = useTour();
  const theme = useTheme();
  const { width: screenW, height: screenH } = useWindowDimensions();

  if (!tour.active || !tour.containerSpot) return null;
  const step = tour.steps[tour.stepIndex];
  const container = tour.containerSpot;

  const rawSpot: Spot | null =
    step.kind === 'tab' ? tour.tabSpots[step.key] ?? null : tour.supportSpot;
  if (!rawSpot) return null;
  const spot = toLocal(rawSpot, container);

  const isLast = tour.stepIndex === tour.steps.length - 1;
  const bubbleWidth = Math.min(320, screenW - 32);
  const centerX = Math.min(Math.max(spot.x + spot.width / 2, bubbleWidth / 2 + 16), screenW - bubbleWidth / 2 - 16);

  const bubbleBelow = step.kind === 'support';
  const bubbleStyle = bubbleBelow
    ? { top: spot.y + spot.height + 12, left: centerX - bubbleWidth / 2, width: bubbleWidth }
    : { bottom: screenH - (container.y + spot.y) + 12, left: centerX - bubbleWidth / 2, width: bubbleWidth };

  // Tab-bar strip cover: dim everything except the highlighted tab.
  const tabStrip = step.kind === 'tab';
  const stripTop = spot.y;
  const stripHeight = spot.height + 24;

  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={styles.dim} pointerEvents="none" />

      {tabStrip && (
        <>
          <View
            style={[styles.strip, { top: stripTop, height: stripHeight, left: 0, width: Math.max(0, spot.x - 8), backgroundColor: 'rgba(0,0,0,0.55)' }]}
            pointerEvents="auto"
          />
          <View
            style={[styles.strip, { top: stripTop, height: stripHeight, left: spot.x + spot.width + 8, right: 0, backgroundColor: 'rgba(0,0,0,0.55)' }]}
            pointerEvents="auto"
          />
          <View
            style={[
              styles.ring,
              {
                left: spot.x - 8,
                top: spot.y - 8,
                width: spot.width + 16,
                height: spot.height + 16,
                borderColor: theme.colors.primary,
              },
            ]}
            pointerEvents="none"
          />
        </>
      )}

      {!tabStrip && (
        <View
          style={[
            styles.ring,
            {
              left: spot.x - 8,
              top: spot.y - 8,
              width: spot.width + 16,
              height: spot.height + 16,
              borderColor: theme.colors.primary,
            },
          ]}
          pointerEvents="none"
        />
      )}

      <View
        style={[styles.bubble, bubbleStyle, { backgroundColor: theme.colors.surface }]}
        accessible
        accessibilityRole="alert"
        accessibilityLabel={`Tour step ${tour.stepIndex + 1} of ${tour.steps.length}: ${step.title}. ${step.body}`}
      >
        <AppText variant="label" color="secondary">
          {tour.stepIndex + 1} of {tour.steps.length}
        </AppText>
        <AppText variant="h2" style={styles.bubbleTitle}>{step.title}</AppText>
        <AppText variant="bodySmall" style={styles.bubbleBody}>{step.body}</AppText>
        <View style={styles.actions}>
          <Button
            title="Back"
            variant="text"
            onPress={tour.back}
            disabled={tour.stepIndex === 0}
          />
          <Button title="Skip tour" variant="text" onPress={tour.skipTour} />
          <Button title={isLast ? 'Got it' : 'Next'} onPress={tour.next} variant="primary" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
  },
  dim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  strip: {
    position: 'absolute',
  },
  ring: {
    position: 'absolute',
    borderWidth: 3,
    borderRadius: 18,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bubbleTitle: {
    marginTop: 4,
  },
  bubbleBody: {
    marginTop: 6,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
});
