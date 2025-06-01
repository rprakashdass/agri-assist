import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SERVER_URL from '@/config/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useLanguage } from '../src/context/LanguageContext';
import Navbar from '@/src/components/Navbar';

interface WeatherData {
  timestamp: string;
  fetch_time: number;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_main: string;
  weather_description: string;
  clouds: number;
  city: string;
  rain_chance: number;
}

const WeatherApp: React.FC = () => {
  const { t } = useLanguage ();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/fetch-current-weather-data`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError('Failed to fetch weather data. Check network or CORS settings.');
        console.error('Fetch error:', err);
      }
    };

    fetchWeather();
  }, []);

  return (
    <LinearGradient colors={['#4CAF50', '#2E7D32', '#1B5E20']} style={styles.container}>
      <Navbar/>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : weatherData ? (
            <View style={styles.weatherCard}>
              {/* Main Weather Info */}
              <Text style={styles.city}>{weatherData.city}</Text>
              <View style={styles.tempContainer}>
                <Icon name="thermometer" size={40} color="#1B5E20" />
              <Text style={styles.temp}>{`${Math.round(weatherData.temp)}°C`}</Text>
              </View>
              <Text style={styles.description}>{weatherData.weather_description}</Text>

              {/* Key Details (Original) */}
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Feels Like</Text>
                  <Text style={styles.value}>{`${Math.round(weatherData.feels_like)}°C`}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Humidity</Text>
                  <Text style={styles.value}>{`${weatherData.humidity}%`}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Wind Speed</Text>
                  <View style={styles.iconValue}>
                  <Icon name="weather-windy" size={20} color="#1B5E20" />
                    <Text style={styles.value}>{`${weatherData.wind_speed} m/s`}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Rain Chance</Text>
                  <Text style={styles.value}>{`${weatherData.rain_chance}%`}</Text>
                </View>
              </View>

              {/* Additional Details */}
              <View style={styles.extraDetails}>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Min Temp</Text>
                  <Text style={styles.value}>{`${Math.round(weatherData.temp_min)}°C`}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Max Temp</Text>
                  <Text style={styles.value}>{`${Math.round(weatherData.temp_max)}°C`}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Pressure</Text>
                  <Text style={styles.value}>{`${weatherData.pressure} hPa`}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Wind Direction</Text>
                  <View style={styles.iconValue}>
                  <Icon name="compass" size={20} color="#1B5E20" />
                    <Text style={styles.value}>{`${weatherData.wind_direction}°`}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Cloud Cover</Text>
                  <View style={styles.iconValue}>
                  <Icon name="weather-cloudy" size={20} color="#1B5E20" />
                    <Text style={styles.value}>{`${weatherData.clouds}%`}</Text>
                  </View>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Timestamp</Text>
                  <Text style={styles.value}>{new Date(weatherData.timestamp).toLocaleString()}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.label}>Fetch Time</Text>
                  <Text style={styles.value}>{new Date(weatherData.fetch_time * 1000).toLocaleString()}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>Loading Weather...</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  innerContainer: { width: '90%', maxWidth: 400, paddingVertical: 20 },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  city: { fontSize: 28, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  tempContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  temp: { fontSize: 64, fontWeight: '300', color: '#1B5E20', textAlign: 'center' }, // Changed to green
  description: { fontSize: 18, color: '#666', textAlign: 'center', textTransform: 'capitalize', marginBottom: 20 },
  details: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  extraDetails: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 20 },
  detailItem: { width: '48%', marginBottom: 15 },
  label: { fontSize: 14, color: '#888' },
  value: { fontSize: 18, fontWeight: '500', color: '#333' },
  iconValue: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  loadingContainer: { alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#fff', marginTop: 10 },
  errorContainer: { backgroundColor: 'rgba(255, 75, 75, 0.9)', borderRadius: 10, padding: 15 },
  errorText: { fontSize: 16, color: '#fff', textAlign: 'center' },
});

export default WeatherApp;