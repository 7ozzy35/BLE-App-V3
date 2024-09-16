// LoginScreen.js
import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {DeviceContext} from './Context/DevicesContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PinScreen from './PinScreen';

const LoginScreen = ({navigation}) => {
  const {
    myId,
    userToken,
    setUserToken,
    kartNo,
    setKartNo,
    kurulumState,
    setKurulumState,
  } = useContext(DeviceContext);

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [kartNoLocal, setKartNoLocal] = useState(null);

  const LoginControl = async () => {
    //Cihaz yokken giriş için yapıldı
    const gelenDeger = await AsyncStorage.getItem('my-CardNumber');
    await AsyncStorage.setItem('my-key', '12:6C:14:38:54:50');
    if (gelenDeger) {
      handleLogin(gelenDeger);
    }
  };

  useEffect(() => {
    LoginControl();
  }, []);

  const handleLogin = async kartNo1 => {
    setError('');

    const gelenDeger = await AsyncStorage.getItem('my-key');
    await AsyncStorage.setItem('my-CardNumber', kartNo);
    try {
      console.log('my Id nedir acaba ==>>', gelenDeger);
      const userSnapshot = await firestore()
        .collection(gelenDeger)
        .where('Kart No', '==', kartNo1)
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
        <Image
          source={require('./assets/noronlogo.png')}
          style={styles.image}
          resizeMode="contain"
        />
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
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            handleLogin(kartNo);
          }}>
          <Text style={styles.buttonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            setKurulumState(false);
          }}>
          <Text style={styles.buttonText}>Kurulum</Text>
        </TouchableOpacity>
        <View style={styles.mediaIcons}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://noron.com.tr/')}>
            <Image source={require('./assets/web.png')} style={styles.icons} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://www.linkedin.com/company/n%C3%B6ron-teknoloji/mycompany/',
              )
            }>
            <Image
              source={require('./assets/linkedin.png')}
              style={styles.icons}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 130,
    backgroundColor: '#F3F8FF',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  icons: {
    width: 40,
    height: 40,
  },
  mediaIcons: {
    marginTop: 50,
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },
  image: {
    height: 200,
    width: 200,
  },
  formContainer: {
    backgroundColor: '#F3F8FF',
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
    backgroundColor: '#211951',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default LoginScreen;
