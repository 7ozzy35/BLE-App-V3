import React from 'react';
import firestore from '@react-native-firebase/firestore';

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {DeviceContext} from './Context/DevicesContext';
import {useContext, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Octicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminScreen = ({navigation}) => {
  const {
    myId,
    setMyId,
    kartNo,
    setUserToken,
    connectedDevice,
    setConnectedDevice,
    handleDoorOpen,
    disconnectDevice,
    disconnectMessage,
    disconnectButtonVisible,
    setDisconnectButtonVisible,
    isButtonDisabled,
    setIsButtonDisabled,
  } = useContext(DeviceContext);
  // const myId = "12:6C:14:38:F5:40";
  // Replace with your device ID

  const IdControl = async () => {
    const gelenDeger = await AsyncStorage.getItem('my-key');
    console.log(gelenDeger);
    setMyId(gelenDeger);
  };

  const checkPaymentStatus = async () => {
    try {
      const paymentDoc = await firestore().collection(myId).doc(kartNo).get();

      if (paymentDoc.exists) {
        const paymentData = paymentDoc.data();
        if (paymentData.Pay === true) {
          console.log('Ödeme başarılı');
        } else {
          console.log('Ödeme başarısız');
        }
      } else {
        console.log('Ödeme bilgisi bulunamadı');
      }
    } catch (error) {
      console.error('Ödeme durumu kontrol edilirken hata oluştu:', error);
    }
  };

  useEffect(() => {
    IdControl();
    checkPaymentStatus();
  }, []);

  const CardSil = async () => {
    await AsyncStorage.removeItem('my-CardNumber');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Yönetici Ekranı</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handlePress('Ayarlar')}>
          <Image
            source={require('./assets/gear_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => {
            navigation.replace('Login'), setUserToken(false), CardSil();
          }}>
          <Icon name={'sign-out'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        {/* <View>
        {disconnectMessage ? <Text style={styles.disconnectMessage}>{disconnectMessage}</Text> : null} 
        </View> */}
        <TouchableNativeFeedback
          onPress={() => {
            console.log('kart numarası .:', kartNo), handleDoorOpen(kartNo);
          }}
          background={TouchableNativeFeedback.Ripple('blue', true, -20)}
          disabled={isButtonDisabled}>
          <View
            style={[styles.button, isButtonDisabled && styles.disabledButton]}>
            <Text style={styles.buttonText}>KAPI AÇ</Text>
          </View>
        </TouchableNativeFeedback>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('Admina');
          }}>
          <Text style={styles.buttonText}>KULLANICI İŞLEMLERİ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Aktarim')}>
          <Text style={styles.buttonText}>AKTARIM</Text>
        </TouchableOpacity>
        {/* {connectedDevice && disconnectButtonVisible && (
          <View style={styles.connectedDevice}>
            <Text style={styles.connectedDeviceText}>Connected to: {connectedDevice.name || 'Unnamed device'}</Text>
            <TouchableOpacity style={styles.button} onPress={() => disconnectDevice(true)}>
              <Text style={styles.text}>Kapı Bağlantısını kes</Text>
            </TouchableOpacity>
          </View>)} */}
      </View>

      {/*  Home sayfası yönlendirme butonu  */}
      <View
        style={{
          backgroundColor: 'green',
          width: 60,
          position: 'absolute',
          top: 150,
          right: 10,
          height: 60,
          borderRadius: 8,
        }}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={() => {
            navigation.navigate('Home');
          }}>
          <Text> Home </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: 'green',
          width: 60,
          position: 'absolute',
          top: 220,
          right: 10,
          height: 60,
          borderRadius: 8,
        }}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={() => {
            navigation.navigate('Background');
          }}>
          <Text> Back </Text>
          <Text> Task </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: 'green',
          width: 160,
          position: 'absolute',
          bottom: 100,
          right: 120,
          height: 80,
          borderRadius: 8,
        }}>
        <TouchableOpacity
          style={{justifyContent: 'center', alignItems: 'center', flex: 1}}
          onPress={() => {
            navigation.navigate('PayTr');
          }}>
          <Text style={{fontSize: 20}}> Ödeme Yap </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#F0F3FF',
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 35,
    height: 35,
  },
  connectedDevice: {
    backgroundColor: 'cloudy',
    padding: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  connectedDeviceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#211951',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
  },
  disabledButton: {
    backgroundColor: '#999999',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disconnectMessage: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default AdminScreen;
