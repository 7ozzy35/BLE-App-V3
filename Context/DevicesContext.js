import React, { useState, createContext, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import firestore from '@react-native-firebase/firestore';
import { showError, showSuccess } from "../Component/helperFunctions";
import { OpenDoorComment, characteristicUUID, serviceUUID } from '../Component/DeviceInfo'

export const DeviceContext = createContext();
let bleManager = new BleManager();

export const DeviceProvider = ({ children }) => {

  const uniqueNumbers = new Set();

  const [myId, setMyId] = useState('myID boşşşş');
  const [kurulumState, setKurulumState] = useState(true);
  const [kartNo, setKartNo] = useState('');
  const [kartSayisi, setKartSayisi] = useState(0);
  const [userToken, setUserToken] = useState(false);
  const [userİnfo, setUserİnfo] = useState(null);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [disconnectButtonVisible, setDisconnectButtonVisible] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const resetBleManager = () => {
    bleManager.destroy();
    setTimeout(() => {
      bleManager = new BleManager();
      console.log('BleManager reset');
    }, 1000);
  };

  const handleDoorOpen = useCallback(async (cardNum) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      await sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:4:3>`);
      console.log('Door open command sent');
      console.log('Kart Numarası', kartNo);

      showSuccess("kapı açma başarılı")
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
    }, 2500);
  }, [myId]);

  const sendComment = useCallback(async (sendData) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      await sendDataToDevice(device, serviceUUID, characteristicUUID, sendData);
      console.log('Door open command sent');
      if (sendData === "<1:A>") {
        showSuccess("Cihaz Güncelleniyor lütfen 10 - 15 saniye bekleyiniz...");
      }
      if (sendData === "<1:C>") {
        console.log("Gönderilen data belli neyi sorguluyon ");
      }
      const disconnectDevice2 = async () => {
        if (device) {
          try {
            if (bleManager.state !== 'destroyed') {
              await bleManager.cancelDeviceConnection(myId);
              console.log('Disconnected from device sendComment');
              console.log("Benzersiz sayılar kümesi2:", uniqueNumbers);
              
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
    }, 2500);
  }, [myId]);

  const sendCardData = useCallback(async (usersList) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      await usersList.forEach(element => {
        sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:8:${element["Kart No"]}:001>`);
      });

      console.log('Add Card command sent');
      showSuccess("Kart Aktarma başarılı")
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
    }, 2500);
  }, [myId]);

  const sendDeleteCardData = useCallback(async (usersList) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      await usersList.forEach(element => {
        sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:9:${element["Kart No"]}>`);
      });

      console.log('Delete Card command sent');
      const disconnectDevice2 = async () => {
        if (device) {
          try {
            if (bleManager.state !== 'destroyed') {
              await bleManager.cancelDeviceConnection(myId);
              console.log('Disconnected from deviceee');
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
    }, 2500);
  }, [myId]);

  const veriOkuma = async (device, serviceUUID, characteristicUUID, kartSayisi) => {
    console.log("veriOkuma içine girdi");
    if(kartSayisi){
      for (let index = 0; index < kartSayisi; index++) {
        console.log("veriOkuma içine girdi for içinede girdi");
        const formattedIndex = index.toString().padStart(4, '0');
        console.log("formated İndex::>>>", formattedIndex);
        await sendDataToDevice2(device, serviceUUID, characteristicUUID, `<1:P:${formattedIndex}>`);
      }
    }
  };

  const veriYazdır = async () => {
    console.log("Veri yazdırma işlemi başladı");
    console.log("Benzersiz sayılar kümesi:", uniqueNumbers);

    const db = firestore();
    const collectionName = myId;

    for (const cardNumber of uniqueNumbers) {
      const querySnapshot = await db.collection(collectionName)
        .where("Kart No", "==", cardNumber)
        .get();

      if (querySnapshot.empty) {
        await db.collection(collectionName).add({
          "Kart No": cardNumber,
          "Pay": true,
          "Onay": true,
          "Yetki": false,
          "Daire Numarası": ""
        });
        console.log(`Yeni kart kaydedildi: ${cardNumber}`);
      } else {
        console.log(`Kart zaten mevcut: ${cardNumber}`);
      }
    }

    showSuccess("Kartlar veritabanına başarıyla kaydedildi.");
  };

  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, message) => {
    try {
      // Cihazın tüm servislerini ve karakteristiklerini keşfet
      await device.discoverAllServicesAndCharacteristics();
  
      // Keşfedilen servisleri al
      const services = await device.services();
  
      // Servis UUID'sine göre ilgili servisi bul
      const service = services.find(service => service.uuid === serviceUUID);
      if (!service) {
        console.error('Service not found:', serviceUUID);
        return;
      }
  
      // Servis içindeki karakteristikleri al
      const characteristics = await service.characteristics();
  
      // Karakteristik UUID'sine göre ilgili karakteristiği bul
      const characteristic = characteristics.find(char => char.uuid === characteristicUUID);
      if (!characteristic) {
        console.error('Characteristic not found:', characteristicUUID);
        return;
      }
  
      // Mesajı base64 formatına çevir
      const buffer = Buffer.from(message, 'utf-8');
      const base64Message = buffer.toString('base64');
  
      // Mesajı cihaza gönder
      await characteristic.writeWithResponse(base64Message);
      console.log('Data sent:', message);
    } catch (error) {
      console.error('Error sending data to device:', error);
    }
  };

  const sendDataToDevice2 = async (device, serviceUUID, characteristicUUID, message) => {
    const service = await device.services();
    const serviceIndex = service.findIndex(s => s.uuid === serviceUUID);
    if (serviceIndex === -1) {
      console.error('Service not found:', serviceUUID);
      return;
    }

    const characteristic = await service[serviceIndex].characteristics();
    const characteristicIndex = characteristic.findIndex(c => c.uuid === characteristicUUID);
    if (characteristicIndex === -1) {
      console.error('Characteristic not found:', characteristicUUID);
      return;
    }

    const buffer = Buffer.from(message, 'utf-8');
    await device.writeCharacteristicWithResponseForService(serviceUUID, characteristicUUID, buffer.toString('base64'));
    console.log('Data sent:', message);
    
    if (message) {
      const base64Value = await device.readCharacteristicForService(serviceUUID, characteristicUUID);
      const bufferValue = Buffer.from(base64Value.value, 'base64');
      const decodedValue = bufferValue.toString('utf-8');
      const parsedValue = decodedValue.slice(4, 12);
      uniqueNumbers.add(parsedValue);
      console.log("Decoded Value:", parsedValue);
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        myId,
        setMyId,
        kurulumState,
        setKurulumState,
        kartNo,
        setKartNo,
        kartSayisi,
        setKartSayisi,
        userToken,
        setUserToken,
        userİnfo,
        setUserİnfo,
        connectedDevice,
        setConnectedDevice,
        handleDoorOpen,
        disconnectMessage,
        disconnectButtonVisible,
        isButtonDisabled,
        sendCardData,
        sendDeleteCardData,
        veriYazdır,
        sendComment,
        veriOkuma
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
