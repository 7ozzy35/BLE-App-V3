//User.js
import React, { useState, useEffect, useContext, createContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform, Image } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { DeviceContext } from './Context/DevicesContext'


const bleManager = new BleManager();

const App = () => {
  const {connectedDevice,setConnectedDevice, handleDoorOpen, disconnectDevice, disconnectMessage, disconnectButtonVisible, setDisconnectButtonVisible} = useContext(DeviceContext)
  const myId = "12:6C:14:38:F5:40"; // Replace with your device ID

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);

          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Location and Bluetooth permissions granted');
          } else {
            console.log('Location and/or Bluetooth permissions denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };

    requestPermissions();

    return () => {
      bleManager.destroy();
    };
  }, []);

//   const handleDoorOpen = async () => {
//     try {
//       const device = await bleManager.connectToDevice(myId);
//       await device.discoverAllServicesAndCharacteristics();
//       setConnectedDevice(device);
//       setDisconnectMessage('');
//       setDisconnectButtonVisible(true);
//       const data = '<1:4:1>';
//       await sendDataToDevice(device, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', data);
//       console.log('Door open command sent');

//       // Automatically disconnect after 8 seconds
//       setTimeout(async () => {
//         await disconnectDevice(false);
//         setDisconnectMessage('Kapı bağlantısı kesildi');
//         setConnectedDevice(null);
//       }, 8000);
//     } catch (error) {
//       console.error('Failed to open door:', error);
//     }
//   };

//   const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
//     try {
//       const characteristic = await device.writeCharacteristicWithResponseForService(
//         serviceUUID,
//         characteristicUUID,
//         Buffer.from(data).toString('base64')
//       );
//       console.log('Data sent:', characteristic);
//     } catch (error) {
//       console.error('Failed to send data:', error);
//     }
//   };

//   const disconnectDevice = async (manual = true) => {
//     if (connectedDevice) {
//       try {
//         if (bleManager.state !== 'destroyed') {
//           await bleManager.cancelDeviceConnection(connectedDevice.id);
//           console.log('Disconnected from device');
//           setConnectedDevice(null);
//           if (manual) {
//             setDisconnectMessage('Kapı bağlantısı manuel olarak kesildi');
            
//           }
//           setDisconnectButtonVisible(false);
//         } else {
//           console.error('BleManager is destroyed and cannot disconnect');
//         }
//       } catch (error) {
//         console.error('Failed to disconnect:', error);
//       }
//     }
//   };


  return (
    <DeviceContext.Provider value={{ connectedDevice, setConnectedDevice }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}t>
          <Text style={styles.headerText}>Kullanıcı Ekranı</Text>
          
          <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
            <Image source={require('./assets/gear_icon.png')} style={styles.icon} />
             </TouchableOpacity>      
        </View>
        <View>
        {disconnectMessage ? <Text style={styles.disconnectMessage}>{disconnectMessage}</Text> : null} 
        </View>
        <TouchableOpacity style={styles.button} onPress={handleDoorOpen }>
          <Text style={styles.buttonText}>KAPI AÇ</Text>
        </TouchableOpacity>
        {connectedDevice && disconnectButtonVisible && (
          <View style={styles.connectedDevice}>
            <Text style={styles.connectedDeviceText}>Connected to: {connectedDevice.name || 'Unnamed device'}</Text>
            <TouchableOpacity style={styles.button} onPress={() => disconnectDevice(true)}>
              <Text style={styles.text}>Kapı Bağlantısını kes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </DeviceContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: '#F8F4E1',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
    margin: 20,
  },
  iconButton: {
    padding: 20,
  },
  icon: {
    width: 35,
    height: 35,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    margin: 50,
  },
  button: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2E236C',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
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
  disconnectButton: {
    backgroundColor: '#dc3545',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  doorOpenButton: {
    backgroundColor: '#ff9800',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
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
  disconnectMessage: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default App;
