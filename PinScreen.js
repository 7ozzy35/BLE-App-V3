import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PinScreen = ({ navigation }) => {
  const { kartNo } = route.params; // Retrieve kartNo from route params
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handlePinSubmit = async () => {
    try {
      const userSnapshot = await firestore()
        .collection("12:6C:14:38:54:50")
        .where('Kart No', '==', kartNo)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        if (userData['Sifre'] === pin) { // Validate the PIN
          navigation.replace('adminf'); // Navigate to admin page
        } else {
          setError('Şifre Hatalı!');
        }
      } else {
        setError('Kullanıcı bulunamadı!');
      }
    } catch (error) {
      console.error('Error validating PIN: ', error);
      setError('Şifre doğrulama sırasında bir hata oluştu.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.profileContainer}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
    
        <Text style={styles.userType}>Yönetici</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={'gray'}
          value={pin}
          onChangeText={setPin}
          secureTextEntry={true}
          keyboardType="numeric"
          maxLength={6}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.submitButton} onPress={handlePinSubmit}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarPlaceholder: {
    backgroundColor: '#2C2C2C',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: '#FFF',
  },
  username: {
    marginTop: 10,
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 16,
    color: '#808080',
  },
  inputContainer: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  input: {
    height: 50,
    fontSize: 24,
    color: '#FFF',
    letterSpacing: 10,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#3B3B3B',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  resetText: {
    color: '#808080',
    fontSize: 14,
  },
});

export default PinScreen;
