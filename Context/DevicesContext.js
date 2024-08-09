import React, { useState, createContext, useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { OpenDoorComment, characteristicUUID, serviceUUID } from '../Component/DeviceInfo'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showError, showSuccess } from "../Component/helperFunctions";
import { Console } from 'console';
import { checkAndAddDocument } from '../FirestoreService';

export const DeviceContext = createContext();
let bleManager = new BleManager();
const uniqueNumbers = new Set(); 
export const DeviceProvider = ({ children }) => {

   // Benzersiz sayılar için küme

  const [myId, setMyId] = useState('myID boşşşş');
  const [kurulumState, setKurulumState] = useState(true);
  const [kartNo, setKartNo] = useState('');
  const [kartSayisi, setKartSayisi] = useState(0);

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



  const handleDoorOpen = useCallback(async (cardNum) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      // const data = '<1:34625:4:3>';
      await sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:4:3>`);
      // await sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:${cardNum}:4:3>`);
      console.log('Door open command sent');
      console.log('kaRT NUMANRASI', kartNo);

      showSuccess("kapı açma başarılı")
      const disconnectDevice2 = async () => {
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

      // const data = '<1:34625:4:3>';
      await sendDataToDevice(device, serviceUUID, characteristicUUID, sendData);

      
      
      
      
      console.log('Door open command sent');
      if (sendData == "<1:A>") {
        showSuccess("Cihaz Güncelleniyor lütfen 10 - 15 saniye bekleyiniz...")
      }
      if (
        sendData == "<1:C>"
      ) {
        console.log("Gönderilen data beelii neyi sorguluyon ")

      }
      const disconnectDevice2 = async () => {
        if (device) {
          try {
            // Geçici olarak erişilebilirlik kontrolü
            if (bleManager.state !== 'destroyed') {
              await bleManager.cancelDeviceConnection(myId);
              console.log('Disconnected from device sendComment');
              console.log("Benzersiz sayılar kümesi2:", uniqueNumbers);
              console.log("Benzersiz sayılar kümesi2:", uniqueNumbers.size);
              
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
  const sendDevicesCard = useCallback(async (sendData) => {
    setIsButtonDisabled(true);
    try {
      const device = await bleManager.connectToDevice(myId);
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected:", device);
      setConnectedDevice(device);
      setDisconnectMessage('');
      setDisconnectButtonVisible(true);

      // const data = '<1:34625:4:3>';
      await sendDataToDevice(device, serviceUUID, characteristicUUID, sendData);

      
      
      
      
      console.log('Door open command sent');
      if (sendData == "<1:A>") {
        showSuccess("Cihaz Güncelleniyor lütfen 10 - 15 saniye bekleyiniz...")
      }
      if (
        sendData == "<1:C>"
      ) {
        console.log("Gönderilen data beelii neyi sorguluyon ")

      }
      const disconnectDevice2 = async () => {
        if (device) {
          try {
            // Geçici olarak erişilebilirlik kontrolü
            if (bleManager.state !== 'destroyed') {
              await bleManager.cancelDeviceConnection(myId);
              console.log('Disconnected from device sendComment');
              console.log("Benzersiz sayılar kümesi2:", uniqueNumbers);
              console.log("Benzersiz sayılar kümesi2:", uniqueNumbers.size);
             

              
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


      // const usersList = [
      //   "34621",
      //   "34622",
      //   "34623",
      //   "34624",
      //   "34625",
      //   "34646",
      //   "34647",
      //   "34648",
      //   "34649",
      //   "34650",
      //   "34651",
      //   "34652",




      // ]


      await usersList.forEach(element => {
        sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:8:${element["Kart No"]}:001>`);
      });



      // const data = '<1:34625:4:3>';





      console.log('Add Card command sent');
      showSuccess("Kart Aktarma başarılı")
      const disconnectDevice2 = async () => {
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


      // const usersList = [
      //   "34621",
      //   "34622",
      //   "34623",
      //   "34624",
      //   "34625",
      //   "34646",
      //   "34647",
      //   "34648",
      //   "34649",
      //   "34650",
      //   "34651",
      //   "34652",




      // ]


      await usersList.forEach(element => {
        sendDataToDevice(device, serviceUUID, characteristicUUID, `<1:9:${element["Kart No"]}>`);
      });



      // const data = '<1:34625:4:3>';





      console.log('Delete Card command sent');

      const disconnectDevice2 = async () => {
        if (device) {
          try {
            // Geçici olarak erişilebilirlik kontrolü
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







  const veriOkuma = async (device, serviceUUID, characteristicUUID,kartSayisi) => {
    console.log("veriOkuma içine girdi")
    if(kartSayisi){
      for (let index = 0; index < kartSayisi; index++) {
        console.log("veriOkuma içine girdi for içinede girdi")
          // Index'i dört haneli yapmak için padStart kullanımı
          const formattedIndex = index.toString().padStart(4, '0');
          console.log("formated İndex::>>>",formattedIndex)
          
          
          await sendDataToDevice2(device, serviceUUID, characteristicUUID, `<1:P:${formattedIndex}>`);
          
        }
        
  }
  
  }
  const veriYazdır = async () => {
    console.log("veri yazdır çalışıyor")
    
    const gelenDeger = await AsyncStorage.getItem("my-key");
    console.log("gelen deger ",gelenDeger)
              console.log("BEnzersiz SEt",uniqueNumbers)
              

              for (const number of uniqueNumbers) {
                console.log("İşlenen sayı:", number);
                const result = await checkAndAddDocument(gelenDeger, number);
               
            }
    
    
  
  }

  // data gönderir ve gelen cevapları dinler
  const sendDataToDevice = async (device, serviceUUID, characteristicUUID, data) => {
    try {
      const characteristic = await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        characteristicUUID,
        Buffer.from(data).toString('base64')
      );
      // const veriAktar = async (localData) => {
      //   const characteristic = await device.writeCharacteristicWithResponseForService(
      //     serviceUUID,
      //     characteristicUUID,
      //     Buffer.from(localData).toString('base64')
      // );
      // }
      console.log("gönderilen komut::: >>>", data);

      device.monitorCharacteristicForService(
        serviceUUID,  // Servis UUID
        characteristicUUID,  // Karakteristik UUID
        (error, characteristic) => {
          
          if (error) {
            console.log('Error:', error.message);
            return;
          }
          // Yanıt verisi burada
          const response = Buffer.from(characteristic.value, 'base64').toString('utf-8');

          console.log('Response:', response);
          if (data == "<1:C>") {
            console.log("send data iç komutu belli");

            if (response != "<1:C:0000>") {
              console.log("cihazda kayıtlı kartlar mevcut");
              showSuccess("cihazda kayıtlı kartlar mevcut");
              console.log("cihazda kayıtlı kodu ==>> ", response);

              // 4 haneli sayıyı ayıklayın
              const match = response.match(/(\d{4})>/);
              if (match) {
                const number = parseInt(match[1], 10);
                console.log("Ayıklanan sayı:", number);

                // for döngüsü ile sayıyı dönün
                veriOkuma(device, serviceUUID, characteristicUUID,number);
                
              }
            } else {
              console.log("cihazda kayıtlı kart yok");
              showError("cihazda kayıtlı kart yok");
            }
          }
        }
      );
     

    } catch (error) {
      console.error('Failed to send data:', error);
    }
  };
  const sendDataToDevice2 = async (device, serviceUUID, characteristicUUID, data) => {
    

    try {
        const characteristic = await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            characteristicUUID,
            Buffer.from(data).toString('base64')
        );
        console.log("gönderilen komut::: >>>", data);

        device.monitorCharacteristicForService(
            serviceUUID,  // Servis UUID
            characteristicUUID,  // Karakteristik UUID
            (error, characteristic) => {
                if (error) {
                    console.log('Error2:', error.message);
                    return;
                }
                // Yanıt verisi burada
                const response = Buffer.from(characteristic.value, 'base64').toString('utf-8');

                console.log('Response:', response);

                // RegExp ile ortadaki 5 haneli sayıyı ayıklama
                const match = response.match(/<1:P:(\d{5}):\d{3}>/);
                console.log("match nedir 0=>>>",match)
                if (match) {
                    const number = match[1];
                    uniqueNumbers.add(number);  // Küme içerisine sayıyı ekleme
                    console.log("Eklenen sayı:", number);
                }
              

                
            }
        );

    } catch (error) {
        console.error('Failed to send data:', error);
    }
};

 




  return (
    <DeviceContext.Provider value={{ veriYazdır,sendDevicesCard,myId, setMyId, kurulumState, setKurulumState, sendComment, sendDeleteCardData, sendCardData, kartNo, setKartNo, userİnfo, setUserİnfo, userToken, setUserToken, connectedDevice, setConnectedDevice, handleDoorOpen, sendDataToDevice, disconnectMessage, disconnectButtonVisible, setDisconnectButtonVisible, setDisconnectMessage, isButtonDisabled }}>
      {children}
    </DeviceContext.Provider>
  );
};
