import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext';

const HomeScreen: React.FC = () => {
  const { t } = useLanguage();
  const router = useRouter();

  const handlePress = (screen: string) => {
    router.push({ pathname: `/${screen}` as any });
  };

  return (
    <LinearGradient colors={['#4CAF50', '#2E7D32', '#1B5E20']} style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.card} onPress={() => handlePress('WeatherData')}>
          <Icon name="weather-partly-cloudy" size={24} color="#1B5E20" />
          <Text style={styles.text}>{t('weatherInfo')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handlePress('PlantDiseaseCheckup')}>
          <Icon name="virus" size={24} color="#1B5E20" />
          <Text style={styles.text}>{t('diseaseCheckup')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => handlePress('PlantPestSolution')}>
          <Icon name="bug" size={24} color="#1B5E20" />
          <Text style={styles.text}>{t('pestSolution')}</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{t('appTitle')}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 15,
    marginVertical: 10,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1B5E20',
    marginLeft: 10,
  },
  footer: {
    padding: 10,
    backgroundColor: 'rgba(27, 94, 32, 0.9)',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default HomeScreen;