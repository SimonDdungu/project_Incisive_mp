import "@/global.css";
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import migrations from '../../drizzle/migrations';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { db } from '@/database/connection/connection';
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) {
      console.log('Database migrations successful.');
    }

    if (error) {
      console.error('Database migrations failed:', error);
    }

    if (success || error) {
      SplashScreen.hideAsync();
    }
    
  }, [success, error]);

   if (!success && !error) return null;


  return (
     <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaView>
  );
}
