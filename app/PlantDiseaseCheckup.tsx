import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Navbar from '@/src/components/Navbar';
import { useLanguage } from '@/src/context/LanguageContext';
import SERVER_URL from '@/config/api';

const PlantDiseaseCheckup: React.FC = () => {
  const { t } = useLanguage();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [diseasePrediction, setDiseasePrediction] = useState<{
    predicted: string;
    explanation: string;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // Request camera permission on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Pick image from gallery
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError('Permission to access gallery was denied.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
      setDiseasePrediction(null);
      setError(null);
      setShowCamera(false);
    }
  };

  // Capture image from camera
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        if (photo?.uri) {
          setImageUri(photo.uri);
          setDiseasePrediction(null);
          setError(null);
          setShowCamera(false);
        }
      } catch (err) {
        setError('Failed to capture image from camera.');
        console.error('Camera capture error:', err);
      }
    }
  };

  // Submit image for diagnosis
  const handleSubmit = async () => {
    if (!imageUri) {
      setError('Please select or capture an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setDiseasePrediction(null);

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'plant-image.jpg',
        type: 'image/jpeg',
      } as any);

      const uploadUrl = `${SERVER_URL}/upload/plant-image`;
      console.log('Uploading to:', uploadUrl);

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed! Status: ${uploadResponse.status}, Details: ${errorText}`);
      }

      const data: {
        status: string;
        message: string;
        disease_prediction: { predicted: string; explanation: string };
      } = await uploadResponse.json();
      console.log('Server response:', data);

      if (data.status === 'success' && data.disease_prediction) {
        console.log('Setting disease prediction:', data.disease_prediction);
        setDiseasePrediction(data.disease_prediction);
      } else {
        throw new Error('No valid disease prediction in response');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to process the image: ${errorMessage}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return (
      <View>
        <Text>No access to camera</Text>
        <TouchableOpacity style={styles.captureButton} onPress={requestPermission}>
          <Text style={styles.captureButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#4CAF50', '#2E7D32', '#1B5E20']} style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>{t('diseaseCheckup')}</Text>
          <Text style={styles.subtitle}>Scan or upload a plant image for diagnosis</Text>

          {/* Buttons for scanning and uploading */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => setShowCamera(true)}
            >
              <Text style={styles.imageButtonText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
              <Text style={styles.imageButtonText}>
                {imageUri ? 'Change Image' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Camera view */}
          {showCamera && (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                ref={cameraRef}
                onCameraReady={() => console.log('Camera is ready')}
              />
              <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                <Text style={styles.captureButtonText}>Capture</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Preview captured/uploaded image */}
          {imageUri && !showCamera && (
            <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="contain" />
          )}

          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleSubmit}
            disabled={loading || !imageUri}
          >
            <Text style={styles.captureButtonText}>
              {loading ? 'Processing...' : 'Diagnose Plant'}
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

          {diseasePrediction && (
            <View style={styles.responseContainer}>
              <Text style={styles.responseTitle}>Disease Identified:</Text>
              <Text style={styles.responseText}>{diseasePrediction.predicted}</Text>
              <Text style={styles.responseTitle}>Explanation:</Text>
              <Text style={styles.responseText}>{diseasePrediction.explanation}</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  imageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  imageButtonText: { fontSize: 16, color: '#1B5E20', fontWeight: 'bold' },
  cameraContainer: { width: '100%', height: 300, marginBottom: 20 },
  camera: { flex: 1, borderRadius: 10 },
  captureButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  captureButtonText: { fontSize: 16, color: '#1B5E20', fontWeight: 'bold' },
  imagePreview: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  loadingContainer: { marginTop: 20, alignItems: 'center' },
  errorContainer: {
    backgroundColor: 'rgba(255, 75, 75, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  errorText: { fontSize: 16, color: '#fff', textAlign: 'center' },
  responseContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
  },
  responseTitle: { fontSize: 18, fontWeight: 'bold', color: '#1B5E20', marginBottom: 10 },
  responseText: { fontSize: 16, color: '#333', marginBottom: 10 },
});

export default PlantDiseaseCheckup;