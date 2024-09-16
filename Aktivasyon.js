import React, { useState, useContext } from 'react';
import { View, TextInput, Alert, StyleSheet, Text } from 'react-native';
import { checkAndAddOrUpdateDocument } from './FirestoreService';
import { DeviceContext } from './Context/DevicesContext';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity } from 'react-native-gesture-handler';

const CheckCardPage = () => {
  const [cardNo, setCardNo] = useState('');
  const { kurulumState, setKurulumState } = useContext(DeviceContext);

  const handleCheckCard = async () => {
    try {
      const gelenDeger = await AsyncStorage.getItem("my-key");
      const result = await checkAndAddOrUpdateDocument(gelenDeger, cardNo);
      if (result === 'Kart Numarası kayıtlı değil') {
        setKurulumState(false);
      } else {
        setKurulumState(true);
      }
      Alert.alert('Sonuç', result);
    } catch (error) {
      Alert.alert('Error', 'Bilinmeyen bir hata oluştu');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>KART NO GİRİNİZ</Text>
      <TextInput
        style={styles.input}
        placeholder="Kart No"
        placeholderTextColor={'black'}
        value={cardNo}
        onChangeText={setCardNo}
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleCheckCard}>
        <Text style={styles.buttonText}>Kart No Ekle</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: 'black',
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'darkblue',
  },
  loginButton: {
    backgroundColor: '#2E236C',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default CheckCardPage;
