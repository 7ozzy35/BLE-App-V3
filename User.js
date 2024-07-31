import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';
import { DeviceContext } from './Context/DevicesContext';
import Icon from 'react-native-vector-icons/Octicons';

const App = ({navigation}) => {
  const { setUserToken,handleDoorOpen,isButtonDisabled } = useContext(DeviceContext);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Kullanıcı Ekranı</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => { }}>
          <Image source={require('./assets/gear_icon.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => { navigation.replace("Login"),setUserToken(false) }}>
        <Icon name={"sign-out"} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      {/* <View>
        {disconnectMessage ? <Text style={styles.disconnectMessage}>{disconnectMessage}</Text> : null}
      </View>
      {connectedDevice && disconnectButtonVisible && (
        <View style={styles.connectedDevice}>
          <Text style={styles.connectedDeviceText}>Connected to: {connectedDevice.name || 'Unnamed device'}</Text>
          <TouchableOpacity style={styles.button} onPress={() => disconnectDevice(true)}>
            <Text style={styles.text}>Kapı Bağlantısını kes</Text>
          </TouchableOpacity>
        </View>
      )} */}
      <TouchableNativeFeedback
        onPress={handleDoorOpen}
        background={TouchableNativeFeedback.Ripple('#FFBF78', true,-20)}
        disabled={isButtonDisabled}
      >
        <View style={[styles.button, isButtonDisabled && styles.disabledButton]}>
          <Text style={styles.buttonText}>KAPI AÇ</Text>
        </View>
      </TouchableNativeFeedback>
    </View>
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
  button: {
    position: "absolute",
    bottom: 185,
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: '#DC5F00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    margin: 10,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
 
});

export default App;
