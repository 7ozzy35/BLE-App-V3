import React, { useContext,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DeviceContext } from './Context/DevicesContext';
import { Buffer } from 'buffer'; // buffer paketini içe aktarın
import auth from '@react-native-firebase/auth';


import firestore from '@react-native-firebase/firestore';

const login = async () => {
    
      console.log("autha erişildi")
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

     


    }

const Home = () => {

  const users = firestore().collection('Users').doc("7zRkAweqitW62RO0Qkk9gI2beEl2");
  const usersCollection = firestore().collection('Users').doc("7zRkAweqitW62RO0Qkk9gI2beEl2").get();
  const { connectedDevice, deviceData, setDeviceData } = useContext(DeviceContext);

  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      const characteristic = await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );
      console.log('Data sent:', characteristic);

      // Veriyi gönderdikten sonra, cihazdan gelen yanıtı oku
      const response = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const responseData = Buffer.from(response.value, 'base64').toString('ascii');
      console.log('Response data:', responseData);
      setDeviceData(responseData);

    } catch (error) {
      console.error('Failed to send data or read response:', error);
    }
  };

  const getDataFireStore = async () => {

    console.log("getDataFirestore func çağırıldı")
   
    console.log("gelen user collectler::>>", users)
    console.log("gelen eriler::>>", usersCollection)



  }
  const subscriber = firestore()
  .collection('Users')
  .doc("7zRkAweqitW62RO0Qkk9gI2beEl2")
  .onSnapshot(documentSnapshot => {
    if (documentSnapshot.exists) {
      console.log('User data: ', documentSnapshot.data());
    } else {
      console.log('No such document!');
    }
  }, error => {
    console.error('Error getting document:', error);
  });
  


  const readDataFromDevice = async (device, serviceUUID, characteristicUUID) => {
    try {
      const characteristic = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const data = Buffer.from(characteristic.value, 'base64').toString('ascii');
      console.log('Data read:', data);
      setDeviceData(data);
    } catch (error) {
      console.error('Failed to read data:', error);
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
      <TouchableOpacity onPress={() => { login() }} style={styles.button}>
        <View style={styles.buttonContent}>
          <Text style={styles.text}>Kapı Aç</Text>
        </View>
      </TouchableOpacity>
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
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginVertical: 10, // Düğmeler arasına dikey boşluk ekler
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
    textAlign: 'center', // Metni ortalar
  },
});

export default Home;
