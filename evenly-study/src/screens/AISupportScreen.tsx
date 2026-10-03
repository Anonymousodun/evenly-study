import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppContext } from '../context/AppContext';
import AppText from '../components/common/Text';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { generateId } from '../utils/id';
import { getAIAdvice, QUICK_PROMPTS } from '../utils/aiAdvice';

interface Message {
  id: string;
  from: 'user' | 'ai';
  text: string;
  crisis: boolean;
}

const GREETING: Message = {
  id: 'greeting',
  from: 'ai',
  crisis: false,
  text: "Hi! I'm Evenly AI. I can help with study and rest advice — sleep, focus, exams, breaks. I'm not a therapist and I can't replace a real person. What's on your mind?",
};

export function AISupportScreen({ navigation }: any) {
  const { theme } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const reply = getAIAdvice(trimmed);
    setMessages(prev => [
      ...prev,
      { id: generateId(), from: 'user', text: trimmed, crisis: false },
      { id: generateId(), from: 'ai', text: reply.text, crisis: reply.crisis },
    ]);
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <MaterialCommunityIcons name="robot-outline" size={24} color="#FFFFFF" />
        </View>
        <View>
          <AppText variant="h1">Evenly AI</AppText>
          <AppText variant="caption" color="secondary">Study advice only — not therapy</AppText>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(m => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.from === 'user' ? styles.userBubble : styles.aiBubble,
              {
                backgroundColor: m.from === 'user' ? theme.colors.primary : theme.colors.surface,
                alignSelf: m.from === 'user' ? 'flex-end' : 'flex-start',
              },
            ]}
          >
            <AppText
              variant="bodySmall"
              style={{ color: m.from === 'user' ? '#FFFFFF' : theme.colors.text }}
            >
              {m.text}
            </AppText>
            {m.crisis && (
              <Button
                title="See human support options"
                onPress={() => navigation.navigate('Support')}
                variant="secondary"
              />
            )}
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>

      <View style={styles.chips}>
        {QUICK_PROMPTS.map(prompt => (
          <TouchableOpacity
            key={prompt}
            style={[styles.chip, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
            onPress={() => send(prompt)}
          >
            <AppText variant="caption">{prompt}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.composer}>
        <View style={styles.inputWrap}>
          <Input
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask about sleep, focus, exams…"
            onSubmitEditing={() => send(draft)}
            returnKeyType="send"
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: theme.colors.primary }]}
          onPress={() => send(draft)}
        >
          <MaterialCommunityIcons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Card>
        <AppText variant="caption" color="secondary" style={styles.disclaimer}>
          Evenly AI gives general study advice only. It doesn't diagnose, treat, or replace professional care.
        </AppText>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messages: {
    flex: 1,
  },
  bubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  inputWrap: {
    flex: 1,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  disclaimer: {
    textAlign: 'center',
    lineHeight: 18,
  },
});
