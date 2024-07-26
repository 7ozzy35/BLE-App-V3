import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleLogin = async () => {
    setError('');
    try {
      const userSnapshot = await firestore()
        .collection('Users')
        .where('Telefon No', '==', phone)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        if (userData['Şifre'] === password) {
          if (userData['Yetki']) {
            navigation.navigate('adminf');
          } else {
            navigation.navigate('User');
          }
        } else {
          setError('Şifre hatalı!');
        }
      } else {
        setError('Telefon numarası hatalı!');
      }
    } catch (error) {
      console.error('Error logging in: ', error);
      setError('Giriş sırasında bir hata oluştu.');
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
          onChangeText={setPhone}
          keyboardType="numeric"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Şifre"
            placeholderTextColor={'black'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.icon}>
            <Icon name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    color: 'darkblue',
  },
  icon: {
    padding: 5,
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
