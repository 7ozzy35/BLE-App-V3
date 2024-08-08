import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const bleManager = new BleManager();


import { DeviceContext } from './Context/DevicesContext';
import { showSuccess } from './Component/helperFunctions';

const ScanAndConnect = ({ navigation }) => {

  

  const { connectedDevice, setConnectedDevice } = useContext(DeviceContext);


  const [devices, setDevices] = useState([]);
  const myId = "12:6C:14:38:F5:40";

  useEffect(() => {
    const firstFunc = async () => {
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

      await requestPermissions();
      await disconnectDevice();

    }

    firstFunc();

    return () => {
      bleManager.destroy();
    };
  }, []);
  sentDataController =  async() => {
    if (connectedDevice) {
        sendDataToDevice(connectedDevice, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', '<1:4:1>');
}
  }

  useEffect(() => {
    const interval = setInterval( async() => {
     
      await scanDevices();
      
      await sentDataController();

      await disconnectDevice();
      
      
    }, 3000);
    return () => clearInterval(interval)
  })

  const scanDevices = () => {
    showSuccess("Tarama Başladı")
    setDevices([]);
    bleManager.startDeviceScan(null, null, (error, device) => {
      
      if (error) {
        console.error("Scan error:", error.message, error.reason);
        return;
      }

      setDevices((prevDevices) => {
        if (!prevDevices.find(d => d.id === device.id)) {
          console.log("sinyal gücü:", device.rssi)
          
          if (device.id === myId ) {
            if(device.rssi > -40){
              onConnect(device);
            }
            else{
              if(connectedDevice){
                disconnectDevice();
              }
              
            }

            
          }
          
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });



    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 3000);
  };

  const onConnect = async (device) => {
    console.log("CONNECTED DEVICE:::", device);
    try {
      await bleManager.connectToDevice(device.id);
      await device.discoverAllServicesAndCharacteristics();
      console.log('Connected and services discovered');
      await setConnectedDevice(device);


    } catch (error) {
      console.error(error);
    }
  };

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

  const disconnectDevice = async () => {
    if (connectedDevice) {
      try {
        // Geçici olarak erişilebilirlik kontrolü
        if (bleManager.state !== 'destroyed') {
          await bleManager.cancelDeviceConnection("12:6C:14:38:F5:40");
          console.log('Disconnected from device');
          setConnectedDevice(null);
        } else {
          console.error('BleManager is destroyed and cannot disconnect');
        }
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  };

  const calculateDistance = (rssi, txPower = -59, n = 2) => {
    return Math.pow(10, (txPower - rssi) / (10 * n));
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.disconnectButton} onPress={()=>{disconnectDevice(),navigation.goBack()}}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scanButton} onPress={scanDevices}>
        <Text style={styles.buttonText}>Scan for BLE Devices</Text>
      </TouchableOpacity>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={() => onConnect(item)}>
            <Text style={styles.deviceName}>Device Name: {item.name || 'Unnamed device'}</Text>
            <Text style={styles.deviceId}>Device ID: {item.id}</Text>
            {item.rssi && (
              <>
                <Text style={styles.deviceRssi}>RSSI: {item.rssi}</Text>
                <Text style={styles.deviceDistance}>Estimated Distance: {calculateDistance(item.rssi).toFixed(2)} meters</Text>
              </>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.deviceList}
      />
      {connectedDevice && (
        <View style={styles.connectedDevice}>
          <Text style={styles.connectedDeviceText}>Connected to: {connectedDevice.name || 'Unnamed device'}</Text>
          <TouchableOpacity style={styles.sendButton} onPress={() => { navigation.navigate("HomePage") }}>
            <Text style={styles.buttonText}>Send Data</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 16,
  },
  scanButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  sendButton: {
    backgroundColor: '#28a745',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  disconnectButton: {
    backgroundColor: '#dc3545',
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
  deviceList: {
    alignItems: 'stretch',
  },
  device: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "green"
  },
  deviceId: {
    fontSize: 14,
    color: '#555555',
  },
  deviceRssi: {
    fontSize: 14,
    color: '#555555',
  },
  deviceDistance: {
    fontSize: 14,
    color: '#555555',
  },
  connectedDevice: {
    backgroundColor: '#e2f7e1',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  connectedDeviceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default ScanAndConnect;
