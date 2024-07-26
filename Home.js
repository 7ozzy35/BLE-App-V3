import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DeviceContext } from './Context/DevicesContext';
import { Buffer } from 'buffer';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const login = async () => {
  console.log("autha erişildi");
  auth()
    .signInWithEmailAndPassword('7ozzy35@gmail.com', '123456')
    .then(() => {
      console.log('User account signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    });
};

const Home = () => {
  const [adSoyad, setAdSoyad] = useState('');
  const [daireNo, setDaireNo] = useState('');
  const [email, setEmail] = useState('');
  const [kartNo, setKartNo] = useState('');
  const [telefonNo, setTelefonNo] = useState('');
  const [yetki, setYetki] = useState(false);

  const { connectedDevice, deviceData, setDeviceData } = useContext(DeviceContext);

  useEffect(() => {
    const getDataFireStore = async () => {
      try {
        const userDoc = await firestore().collection('Users').doc("7zRkAweqitW62RO0Qkk9gI2beEl2").get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          setAdSoyad(userData["Ad Soyad"]);
          setDaireNo(userData["Daire No"]);
          setEmail(userData["Email"]);
          setKartNo(userData["Kart No"]);
          setTelefonNo(userData["Telefon No"]);
          setYetki(userData["Yetki"]);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    };

    getDataFireStore();
  }, []);

  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      const characteristic = await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );
      console.log('Data sent:', characteristic);

      const response = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const responseData = Buffer.from(response.value, 'base64').toString('ascii');
      console.log('Response data:', responseData);
      setDeviceData(responseData);
    } catch (error) {
      console.error('Failed to send data or read response:', error);
    }
  };

  const sendata1 = () => {
    sendDataToDevice(connectedDevice, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', '<1:4:1>');
    console.log('Kapı açıldı');
  };

  const sendata2 = () => {
    sendDataToDevice(connectedDevice, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', '<1:6:1>');
    console.log('Kapı kapandı');
  };

  const sendata3 = () => {
    sendDataToDevice(connectedDevice, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', '<1:T>');
    console.log('Kapı durumu alındı');
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.mainText}>Ad Soyad:</Text>
        <Text style={styles.mainText}>{adSoyad}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.mainText}>Daire No:</Text>
        <Text style={styles.mainText}>{daireNo}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.mainText}>Kart No:</Text>
        <Text style={styles.mainText}>{kartNo}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.mainText}>Telefon:</Text>
        <Text style={styles.mainText}>{telefonNo}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.mainText}>Yetki:</Text>
        <Text style={styles.mainText}>{yetki ? 'Evet' : 'Hayır'}</Text>
      </View>
      <TouchableOpacity onPress={sendata2} style={styles.button}>
        <View style={styles.buttonContent}>
          <Text style={styles.text}>Kapı Kapat</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { console.log("KAPI DURUMU:.Ç>>", deviceData) }} style={styles.button}>
        <View style={styles.buttonContent}>
          <Text style={styles.text}>Kapı Durumu</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  mainText: {
    color: "blue",
    margin: 4
  },
  button: {
    width: 250,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 10,
  },
  buttonContent: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Home;
