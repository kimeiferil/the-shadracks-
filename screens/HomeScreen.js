import React from 'react';
import { View, ScrollView, Text, Image, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import styles from '../styles';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header title="SHADRACK'S Family" />
      <ScrollView>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome to the SHADRACK'S Family</Text>
          <Text style={styles.heroSubtitle}>Celebrating our journey, our love, and our legacy</Text>
          
          <Image 
            source={require('../assets/images/family.jpg')} 
            style={styles.familyPhoto}
          />
          
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Gallery')}
          >
            <Text style={styles.buttonText}>View Gallery</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
