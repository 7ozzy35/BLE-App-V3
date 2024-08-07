import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform, TouchableOpacity, Modal } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const bleManager = new BleManager();
import { DeviceContext } from './Context/DevicesContext';
import { showSuccess } from './Component/helperFunctions';

const Kurulum = ({ navigation }) => {
  const { connectedDevice, setConnectedDevice } = useContext(DeviceContext);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

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
    };

    firstFunc();

    return () => {
      bleManager.destroy();
    };
  }, []);

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
    }, 4000);
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

  const calculateDistance = (rssi, txPower = -59, n = 2) => {
    return Math.pow(10, (txPower - rssi) / (10 * n));
  };

  const handleDevicePress = (device) => {
    setSelectedDevice(device);
    setModalVisible(true);
  };

  const renderModalContent = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Cihaz Bilgileri</Text>
        <Text style={styles.modalText}>Cihaz Adı: {selectedDevice.name || 'İsimsiz cihaz'}</Text>
        <Text style={styles.modalText}>Cihaz ID: {selectedDevice.id}</Text>
        {selectedDevice.rssi && (
          <>
            <Text style={styles.modalText}>RSSI: {selectedDevice.rssi}</Text>
            <Text style={styles.modalText}>Tahmini Mesafe: {calculateDistance(selectedDevice.rssi).toFixed(2)} metre</Text>
          </>
        )}
        <Text style={styles.modalText}>Bağlanabilir mi?: {selectedDevice.isConnectable ? 'Evet' : 'Hayır'}</Text>
        <TouchableOpacity style={styles.modalButton} onPress={() => {}}>
          <Text style={styles.modalButtonText}>Cihazı Doğrula</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.modalButtonText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.disconnectButton} onPress={disconnectDevice}>
        <Text style={styles.buttonText}>Disconnect</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scanButton} onPress={scanDevices}>
        <Text style={styles.buttonText}>Scan for BLE Devices</Text>
      </TouchableOpacity>
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.device} onPress={() => handleDevicePress(item)}>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalTitle: {
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
    backgroundColor: '#007bff',
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
