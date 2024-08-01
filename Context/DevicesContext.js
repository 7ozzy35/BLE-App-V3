import React, { useState, createContext, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { myId,OpenDoorComment,characteristicUUID,serviceUUID } from '../Component/DeviceInfo'

export const DeviceContext = createContext();
let bleManager = new BleManager();

export const DeviceProvider = ({ children }) => {

  const [userToken, setUserToken] = useState(false);
  const [userİnfo, setUserİnfo] = useState(null);
  
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [disconnectButtonVisible, setDisconnectButtonVisible] = useState(false);
  // const myId = "12:6C:14:38:54:50"; 
  // Replace with your device ID
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

      // const data = '<1:34625:4:3>';
      await sendDataToDevice(device,serviceUUID, characteristicUUID, OpenDoorComment);
      console.log('Door open command sent');
      const disconnectDevice2= async () => {
        if (device) {
          try {
           // Geçici olarak erişilebilirlik kontrolü
           if (bleManager.state !== 'destroyed') {
            await bleManager.cancelDeviceConnection(myId);
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
    }, 2500);
  }, [myId]);


 

 

  const CardControl = useCallback(async () => {
    setIsButtonDisabled(true);
    try {
      // Cihaza bağlan
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      
  
      // Veri yazma
    await device.writeCharacteristicWithResponseForService(
      '0000ffe0-0000-1000-8000-00805f9b34fb',  // Servis UUID
      '0000ffe1-0000-1000-8000-00805f9b34fb',  // Karakteristik UUID
      "<1:7>",
      Buffer.from("<1:7>").toString('base64')  // Gönderilecek veri
    );
  
    // Yanıtları dinleme
    device.monitorCharacteristicForService(
      '0000ffe0-0000-1000-8000-00805f9b34fb', // Servis UUID
      '0000ffe1-0000-1000-8000-00805f9b34fb',   // Karakteristik UUID
      (error, characteristic) => {
        if (error) {
          console.log('Error:', error.message);
          return;
        }
        // Yanıt verisi burada
        const response = characteristic.value;
        console.log('Response:', response);
      }
    );
  
    } catch (error) {
      console.log('Failed to open door:', error);
      if (error.message.includes('BleManager was destroyed')) {
        console.log("BLE Manager destroyed, resetting...");
        resetBleManager();
      }
    }
    
  }, [myId]);
  
  
  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      const characteristic = await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );

      device.monitorCharacteristicForService(
        serviceUUID,  // Servis UUID
        characteristicUUID,  // Karakteristik UUID
        (error, characteristic) => {
          if (error) {
            console.log('Error:', error.message);
            return;
          }
          // Yanıt verisi burada
          const response = characteristic.value;
          console.log('Response:', Buffer.from(response, 'base64').toString('utf-8'));
        }
      );
     
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
