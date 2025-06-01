import { Stack } from 'expo-router';
import { LanguageProvider } from '@/src/context/LanguageContext'; // Adjust path

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="WeatherData" />
        <Stack.Screen name="PlantDiseaseCheckup" />
        <Stack.Screen name="PlantPestCheckup" />
        <Stack.Screen name="PlantPestSolution" />
      </Stack>
    </LanguageProvider>
  );
}