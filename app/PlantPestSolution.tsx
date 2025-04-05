import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext'; // Add if you want translations

const SERVER_URL = 'https://23cb-2401-4900-67b3-a11a-8c97-beaa-9d61-93bf.ngrok-free.app';

// Simple Markdown parser for bold text
const renderMarkdown = (text: string) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g); // Split by **bold** pattern
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2); // Remove ** from start and end
      return <Text key={index} style={styles.boldText}>{boldText}</Text>;
    }
    return <Text key={index}>{part}</Text>;
  });
};

const PlantPestSolution: React.FC = () => {
  const { t } = useLanguage(); // Optional: for translations
  const [query, setQuery] = useState<string>('');
  const [pestName, setPestName] = useState<string>('');
  const [pesticide, setPesticide] = useState<string>('');
  const [pestImage, setPestImage] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!query.trim()) {
      setError('Please enter a pest query.');
      return;
    }

    setLoading(true);
    setError(null);
    setPestName('');
    setPesticide('');
    setPestImage(null);
    setAiResponse('');

    try {
      const pestResponse = await fetch(`${SERVER_URL}/retrieve_pest_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!pestResponse.ok) {
        const errorText = await pestResponse.text();
        throw new Error(`Failed to retrieve pest data: ${errorText}`);
      }

      const pestData: { pest_name: string; pesticide: string; ai_response: string } = await pestResponse.json();
      console.log('Server response:', pestData); // Log for debugging
      setPestName(pestData.pest_name);
      setPesticide(pestData.pesticide);
      setAiResponse(pestData.ai_response);

      const imageUrl = `${SERVER_URL}/get_pest_image/${encodeURIComponent(pestData.pest_name)}`;
      const imageResponse = await fetch(imageUrl);
      if (imageResponse.ok) {
        setPestImage(imageUrl);
      } else {
        console.warn('No image found for pest:', pestData.pest_name);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error: ${errorMessage}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#4CAF50', '#2E7D32', '#1B5E20']} style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{t('pestSolution') || 'Plant Pest Solution'}</Text>
          <Text style={styles.subtitle}>
            Enter a pest name for suggestions on pesticides and pest images.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="E.g., small green insect"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Processing...' : 'Identify Pest'}
            </Text>
          </TouchableOpacity>

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

          {pestName && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Pest Identified:</Text>
              <Text style={styles.resultText}>{renderMarkdown(pestName)}</Text>

              <Text style={styles.resultTitle}>Recommended Pesticide:</Text>
              <Text style={styles.resultText}>{renderMarkdown(pesticide)}</Text>

              {pestImage && (
                <>
                  <Text style={styles.resultTitle}>Pest Image:</Text>
                  <Image
                    source={{ uri: pestImage }}
                    style={styles.pestImage}
                    resizeMode="contain"
                  />
                </>
              )}

              {aiResponse && (
                <>
                  <Text style={styles.resultTitle}>{'AI Explanation:'}</Text>
                  <Text style={styles.resultText}>{renderMarkdown(aiResponse)}</Text>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', top: 45, overflow: 'hidden' },
  innerContainer: { width: '90%', maxWidth: 400, padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  loadingContainer: { marginTop: 20, alignItems: 'center' },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  errorText: { fontSize: 16, color: '#fff', textAlign: 'center' },
  resultContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  boldText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  pestImage: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
});

export default PlantPestSolution;