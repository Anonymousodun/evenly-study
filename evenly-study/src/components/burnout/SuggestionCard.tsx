import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppContext } from '../../context/AppContext';
import AppText from '../common/Text';
import { Button } from '../common/Button';

interface SuggestionCardProps {
  text: string;
  whyText?: string;
  topicId?: string;
  onOpenTopic?: (topicId: string) => void;
  onWhy?: () => void;
  onApprove?: () => void;
  onDismiss?: () => void;
}

export function SuggestionCard({ text, whyText, topicId, onOpenTopic, onWhy, onApprove, onDismiss }: SuggestionCardProps) {
  const { theme } = useAppContext();
  const [showWhy, setShowWhy] = useState(false);

  const toggleWhy = () => {
    setShowWhy(!showWhy);
    onWhy?.();
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <AppText variant="label" color="secondary">Suggestion</AppText>
      <AppText variant="body" style={styles.text}>{text}</AppText>

      {showWhy && !!whyText && (
        <AppText variant="caption" color="secondary" style={styles.whyText}>
          {whyText}
        </AppText>
      )}

      {showWhy && !!topicId && !!onOpenTopic && (
        <TouchableOpacity onPress={() => onOpenTopic(topicId)}>
          <AppText variant="label" style={{ ...styles.topicLink, color: theme.colors.primary }}>
            Read the 60-second version →
          </AppText>
        </TouchableOpacity>
      )}

      <View style={styles.actions}>
        {whyText ? (
          <TouchableOpacity onPress={toggleWhy}>
            <AppText variant="label" color="secondary">{showWhy ? 'Hide' : 'Why?'}</AppText>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {onApprove && (
          <View style={styles.approveActions}>
            <Button title="Approve" onPress={onApprove} variant="primary" style={styles.actionBtn} />
            <Button title="Dismiss" onPress={onDismiss || (() => {})} variant="text" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  text: {
    marginTop: 8,
    lineHeight: 24,
  },
  whyText: {
    marginTop: 12,
    fontStyle: 'italic',
  },
  topicLink: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  approveActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
});
