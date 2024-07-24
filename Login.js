import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';

const LoginScreen = ({ navigation }) => {
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (phone === '1' && password === '1') {
      navigation.navigate('adminf');
    } else if (phone === '2' && password === '2') {
      navigation.navigate('User');
    } else {
      setError('Telefon numarası veya şifre hatalı!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Giriş Yap</Text>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TextInput
          
          style={styles.input}
          placeholder="(5xx)-xxx-xxxx"
          placeholderTextColor={'black'}
          value={phone}
          onChangeText={setphone}
          keyboardType="phone-pad"
        />
        <TextInput
          
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor={'black'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E1', // Turkuaz rengi
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
    color:'darkblue',
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
    color:'darkblue',
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

export default LoginScreen;
