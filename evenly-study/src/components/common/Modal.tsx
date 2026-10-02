import React from 'react';
import { View, StyleSheet, Modal as RNModal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/AppContext';
import AppText from '../common/Text';
import { Button } from '../common/Button';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ visible, onClose, title, children }: ModalProps) {
  const theme = useTheme();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.header}>
            <AppText variant="h2">{title}</AppText>
            <TouchableOpacity onPress={onClose}>
              <AppText variant="h2">×</AppText>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.body}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  body: {
    flex: 1,
  },
});
