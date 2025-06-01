import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SERVER_URL from '@/config/api';

const PlantPestPrediction: React.FC = () => {
  const [plantName, setPlantName] = useState<string>('');
  const [prediction, setPrediction] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!plantName.trim()) {
      setError('Please enter a plant name.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction('');

    try {
      const response = await fetch(
        `${SERVER_URL}/predict/${encodeURIComponent(plantName)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Prediction failed! Status: ${response.status}, Details: ${errorText}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      setPrediction(data.pest_risk || 'No prediction returned from the server.');
    } catch (err: any) {
      setError(`Failed to fetch prediction: ${err.message || 'Unknown error'}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4CAF50', '#2E7D32', '#1B5E20']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Plant Pest Prediction</Text>
          <Text style={styles.subtitle}>Enter a plant name to predict pest risk</Text>

          <TextInput
            style={styles.input}
            placeholder="E.g., tomato"
            placeholderTextColor="#888"
            value={plantName}
            onChangeText={setPlantName}
          />

          <Button
            title={loading ? 'Predicting...' : 'Get Prediction'}
            onPress={handlePredict}
            color="#1B5E20 font-bold"
            disabled={loading}
          />

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {prediction && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>Pest Risk Prediction:</Text>
              <Text style={styles.responseText}>{prediction}</Text>
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
  innerContainer: { width: '90%', maxWidth: 400, padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#ddd', textAlign: 'center', marginBottom: 20 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  loadingContainer: { marginTop: 20, alignItems: 'center' },
  errorContainer: { backgroundColor: 'rgba(255, 75, 75, 0.9)', borderRadius: 10, padding: 15, marginTop: 20 },
  errorText: { fontSize: 16, color: '#fff', textAlign: 'center' },
  responseContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 10, padding: 15, marginTop: 20 },
  responseTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginBottom: 10 },
  responseText: { fontSize: 16, color: '#333' },
});

export default PlantPestPrediction;