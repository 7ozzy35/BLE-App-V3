import React, { useState, createContext, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { count } from 'console';

export const DeviceContext = createContext();
const bleManager = new BleManager();

export const DeviceProvider = ({ children }) => {
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [disconnectButtonVisible, setDisconnectButtonVisible] = useState(false);
  const myId = "12:6C:14:38:F5:40"; // Replace with your device ID

  const handleDoorOpen = useCallback(async () => {
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      await setConnectedDevice(device);
      await setDisconnectMessage('');
      await setDisconnectButtonVisible(true);

      const data = '<1:4:1>';
      await sendDataToDevice(device, '0000ffe0-0000-1000-8000-00805f9b34fb', '0000ffe1-0000-1000-8000-00805f9b34fb', data);
      console.log('Door open command sent');

      // Automatically disconnect after 10 seconds

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

      // Store the timeout id to clear it if manual disconnect occurs
      device.autoDisconnectTimeout = autoDisconnectTimeout;
    } catch (error) {
      console.log('Failed to open door:', error);
    }
  }, [myId]);

  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );
      console.log('Data sent');
    } catch (error) {
      console.error('Failed to send data:', error);
    }
  };


  // ŞİMDİLİK GEREKSİZ


  const disconnectDevice = useCallback(async () => {
    console.log("31313131",connectedDevice)
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
      console.error('Failed to disconnect2:', error);
      }
    } else {
      console.log('No device connected');
    }
  }, [connectedDevice]);

  return (
    <DeviceContext.Provider value={{ connectedDevice, setConnectedDevice, handleDoorOpen, sendDataToDevice, disconnectDevice, disconnectMessage, disconnectButtonVisible, setDisconnectButtonVisible, setDisconnectMessage }}>
      {children}
    </DeviceContext.Provider>
  );
};
