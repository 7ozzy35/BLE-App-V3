import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RegisterScreen = () => {
  const [AdSoyad, setAdSoyad] = useState('');
  const [surAdSoyad, setSurAdSoyad] = useState('');
  const [DaireNo, setDaireNo] = useState('');
  const [Email, setEmail] = useState('');
  const [KartNo, setKartNo] = useState('');
  const [TelefonNo, setTelefonNo] = useState('');
  const [Şifre, setŞifre] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!AdSoyad  || !DaireNo || !Email || !KartNo|| !TelefonNo || !Şifre) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await firestore().collection('Users').add({
        'Ad Soyad': `${AdSoyad} `,
        'Daire No': DaireNo,
        'Email': Email,
        'Kart No': KartNo,
        'Telefon No': TelefonNo,
        'Yetki': false,
        'Şifre': Şifre,
        
      });
      setError('Kayıt başarıyla tamamlandı!');
    } catch (e) {
      setError('Kayıt sırasında bir hata oluştu: ' + e.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Kayıt Ol</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          style={styles.input}
          placeholder="Ad-Soyad"
          placeholderTextColor={'black'}
          value={AdSoyad}
          onChangeText={setAdSoyad}
        />
        <TextInput
          style={styles.input}
          placeholder="Daire No"
          placeholderTextColor={'black'}
          value={DaireNo}
          onChangeText={setDaireNo}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder="Kart No"
          placeholderTextColor={'black'}
          value={KartNo}
          onChangeText={setKartNo}
          keyboardType='numeric'
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={'black'}
          value={Email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Telefon No"
          placeholderTextColor={'black'}
          value={TelefonNo}
          onChangeText={setTelefonNo}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={'black'}
          value={Şifre}
          onChangeText={setŞifre}
          secureTextEntry={true}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#F8F4E1',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'darkblue',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: 'darkblue',
  },
  registerButton: {
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

export default RegisterScreen;
