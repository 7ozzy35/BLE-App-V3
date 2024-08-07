import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Modal } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const bleManager = new BleManager();
import { DeviceContext } from './Context/DevicesContext';
import { showSuccess } from './Component/helperFunctions';
import AsyncStorage from "@react-native-async-storage/async-storage";

const Kurulum = ({ navigation }) => {
  const { kurulumState, setKurulumState,connectedDevice, setConnectedDevice } = useContext(DeviceContext);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

 

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
          return [...prevDevices, device];
        }
        return prevDevices;
      });
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
    }, 20000);
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



  const handleDevicePress = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };
  
  async function cihazDogrulama(value) {
    
    await AsyncStorage.removeItem('my-key');
    await AsyncStorage.setItem('my-key', value);
  }
  const renderModalContent = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Cihaz Bilgileri</Text>
        <Text style={styles.modalText}>Cihaz Adı: {selectedDevice.name || 'İsimsiz cihaz'}</Text>
        
        <Text style={styles.modalText}>CİHAZ DURUMU = {selectedDevice.isConnectable ? 'AÇIK' : 'KAPALI'}</Text>
        <TouchableOpacity style={styles.modalButton} onPress={() => {
          
          cihazDogrulama(selectedDevice.id),
          navigation.navigate("Aktivasyon")


        }}>
          <Text style={styles.modalButtonText}>Cihazı Doğrula</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={() => {setModalVisible(false)}}>
          <Text style={styles.modalButtonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.disconnectButton} onPress={()=>{setKurulumState(true)}}>
        <Text style={styles.buttonText}>ÇIKIŞ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scanButton} onPress={scanDevices}>
        <Text style={styles.buttonText}>BLUETOOTH CİHAZLARINI TARA</Text>
      </TouchableOpacity>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={() => handleDevicePress(item)}>
            <Text style={styles.deviceName}>CİHAZ ADI :   {item.name || 'Unnamed device'}</Text>
           
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.deviceList}
      />
      {selectedDevice && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          {renderModalContent()}
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4E1',
    padding: 16,
  },
  scanButton: {
    backgroundColor: '#2E236C',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#F8F4E1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
    color:'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
    color:"black"
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#2E236C',
    padding: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Kurulum;
