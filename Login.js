import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { DeviceContext } from './Context/DevicesContext';

const LoginScreen = ({ navigation }) => {
  const { userToken, setUserToken, kartNo, setKartNo} = useContext(DeviceContext);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [kartNoLocal, setKartNoLocal] = useState(null)


  const handleLogin = async () => {
    setError('');
    try {
      const userSnapshot = await firestore()
        .collection('Users')
        .where('Kart No', '==', kartNo)
        .limit(1)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        if (!userData['Onay']) {
          setError('Kullanıcı onaylı değil');
        } else if (userData['Yetki']) {
          setUserToken(true);
          navigation.replace('adminf');
        } else {
          setUserToken(true);
          navigation.replace('User');
        }
      } else {
        setError('Kart Numarası Hatalı!');
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
          placeholder="Kart Numarası Giriniz"
          placeholderTextColor={'black'}
          value={kartNo}
          onChangeText={setKartNo}
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
