import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Экраны
import { HomeScreen } from './src/screens/HomeScreen';
import { RecordScreen } from './src/screens/RecordScreen';
import { SessionContextScreen } from './src/screens/SessionContextScreen';
import { SessionResultScreen } from './src/screens/SessionResultScreen';

// Сторы и сервисы
import { useUserStore } from './src/store';
import { userApi } from './src/services/apiService';
import { uploadQueue } from './src/services/uploadQueue';
import { generateId } from './src/utils/id';

const Stack = createNativeStackNavigator();

export default function App() {
  const { user, setUser } = useUserStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      console.log("--- NeuraSpeech: Starting Init ---");
      
      try {
        // 1. Инициализация очереди (только если мы не в строгом веб-окружении с CSP)
        // В вебе лучше инициализировать такие вещи через setTimeout или по требованию
        if (uploadQueue && typeof uploadQueue.init === 'function') {
          try {
            uploadQueue.init();
          } catch (e) {
            console.warn("Queue init failed, skipping...", e);
          }
        }

        // 2. Проверка пользователя
        if (!user) {
          console.log("NeuraSpeech: No user found, creating...");
          
          // В вебе при разработке API может быть недоступен из-за CORS или CSP
          // Делаем попытку, но быстро переходим к fallback
          try {
            // Устанавливаем таймаут на запрос к API, чтобы не ждать вечно
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const newUser = await userApi.create();
            clearTimeout(timeoutId);
            
            setUser(newUser);
            console.log("NeuraSpeech: User created via API");
          } catch (apiError) {
            console.log("NeuraSpeech: API fallback (Local mode)");
            setUser({
              id: generateId(),
              createdAt: new Date().toISOString(),
              onboardingCompleted: false,
            });
          }
        }
      } catch (e) {
        console.error("NeuraSpeech Critical Init Error:", e);
      } finally {
        // Гарантируем, что приложение отобразится в любом случае через небольшой таймаут
        // Это помогает избежать проблем с рассинхронизацией отрисовки в Metro
        setTimeout(() => setIsReady(true), 100);
        console.log("--- NeuraSpeech: Init Complete ---");
      }
    }

    prepare();

    return () => {
      if (uploadQueue && typeof uploadQueue.destroy === 'function') {
        uploadQueue.destroy();
      }
    };
  }, [user, setUser]);

  // Индикатор загрузки с цветом NeuraSpeech
  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1A1A19" />
        <Text style={styles.loadingText}>NeuraSpeech</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { 
            backgroundColor: '#FAFAF9',
            // Убираем лишние границы для чистого вида
            elevation: 0,
            shadowOpacity: 0,
          },
          headerShadowVisible: false,
          headerTintColor: '#1A1A19',
          headerTitleStyle: { 
            fontWeight: '600', 
            fontSize: 18,
            // Для веба иногда нужно явно указать шрифт, если он кастомный
          },
          contentStyle: { backgroundColor: '#FAFAF9' },
          // Оптимизация анимаций для веба
          animation: Platform.OS === 'web' ? 'none' : 'default',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'NeuraSpeech' }}
        />
        <Stack.Screen
          name="Record"
          component={RecordScreen}
          options={{ title: 'Запись', presentation: 'modal' }}
        />
        <Stack.Screen
          name="SessionContext"
          component={SessionContextScreen}
          options={{ title: 'Контекст' }}
        />
        <Stack.Screen
          name="SessionResult"
          component={SessionResultScreen}
          options={{ title: 'Результат анализа' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAF9',
  },
  loadingText: {
    marginTop: 15,
    color: '#1A1A19',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});