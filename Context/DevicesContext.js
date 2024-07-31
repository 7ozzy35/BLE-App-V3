import React, { useState, createContext, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export const DeviceContext = createContext();
let bleManager = new BleManager();

export const DeviceProvider = ({ children }) => {

  const [userToken, setUserToken] = useState(false);
  const [userİnfo, setUserİnfo] = useState(null);
  
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [disconnectButtonVisible, setDisconnectButtonVisible] = useState(false);
  const myId = "12:6C:14:38:54:50"; // Replace with your device ID
  const rfidName ='12345';
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const resetBleManager = () => {
    bleManager.destroy();
    setTimeout(() => {
      bleManager = new BleManager();
      console.log('BleManager reset');
    }, 1000);
  };

  const disconnectDevice = async (manual = true) => {
    if (connectedDevice) {
      try {
        if (bleManager.state !== 'destroyed') {
          await bleManager.cancelDeviceConnection(connectedDevice.id);
          console.log('Disconnected from device');
          setConnectedDevice(null);
          if (manual) {
            setDisconnectMessage('Kapı bağlantısı manuel olarak kesildi');
          }
          setDisconnectButtonVisible(false);
        } else {
          console.error('BleManager is destroyed and cannot disconnect');
        }
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  };

  const handleDoorOpen = useCallback(async () => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      const data = '<1:4:1>';
      await sendDataToDevice(device, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', data);
      console.log('Door open command sent');
      const disconnectDevice2= async () => {
        if (device) {
          try {
           // Geçici olarak erişilebilirlik kontrolü
           if (bleManager.state !== 'destroyed') {
            await bleManager.cancelDeviceConnection("12:6C:14:38:F5:40");
            console.log('Disconnected from device');
            setConnectedDevice(null);
          } else {
            console.error('BleManager is destroyed and cannot disconnect');
          }
        } catch (count) {
          console.log('bağlantı koptu',count);
          }
        }
      };

      const autoDisconnectTimeout = setTimeout(async () => {
        await disconnectDevice2();
      }, 5000);

      device.autoDisconnectTimeout = autoDisconnectTimeout;
    } catch (error) {
      console.log('Failed to open door:', error);
      if (error.message.includes('BleManager was destroyed')) {
        console.log("BLE Manager destroyed, resetting...");
        resetBleManager();
      }
    }
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  }, [myId]);

  
  const CardControl = useCallback(async (data) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);
  
      await sendDataToDevice(device, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', data);
      console.log('Command sent');
  
      // Veriyi okuyacağımız karakteristik UUID'yi belirleyin
      const serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
      const characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';
  
      // Cihazdan veri okuma
      const readData = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const decodedData = Buffer.from(readData.value, 'base64').toString('utf-8');
      console.log('Received data:', decodedData);
  
      const disconnectDevice2 = async () => {
        if (device) {
          try {
            if (bleManager.state !== 'destroyed') {
              await bleManager.cancelDeviceConnection(myId);
              console.log('Disconnected from device');
              setConnectedDevice(null);
            } else {
              console.error('BleManager is destroyed and cannot disconnect');
            }
          } catch (count) {
            console.log('bağlantı koptu', count);
          }
        }
      };
  
      const autoDisconnectTimeout = setTimeout(async () => {
        await disconnectDevice2();
      }, 2500);
  
      device.autoDisconnectTimeout = autoDisconnectTimeout;
    } catch (error) {
      console.log('Failed to open door:', error);
      if (error.message.includes('BleManager was destroyed')) {
        console.log("BLE Manager destroyed, resetting...");
        resetBleManager();
      }
    }
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);
  }, [myId]);
  
  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      const characteristic = await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );
      console.log('Data sent:', characteristic);
    } catch (error) {
      console.error('Failed to send data:', error);
    }
  };
  

  return (
    <DeviceContext.Provider value={{ userİnfo, setUserİnfo,userToken, setUserToken,connectedDevice, setConnectedDevice, handleDoorOpen, sendDataToDevice, disconnectDevice, disconnectMessage, disconnectButtonVisible, setDisconnectButtonVisible, setDisconnectMessage, isButtonDisabled,CardControl }}>
      {children}
    </DeviceContext.Provider>
  );
};
