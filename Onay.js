import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { TouchableOpacity } from 'react-native-gesture-handler';

const AddUserForm = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');

  const handleAddUser = async () => {
    if (!cardNumber) {
      Alert.alert('Kayıt Hatası', 'Kart Numarası boş bırakılamaz!.');
      return;
    }

    try {
      await firestore().collection('Users').add({
        'Kart No': cardNumber,
        'Daire No': apartmentNumber,
        'Yetki': false,
        'Onay': true,
      });
      Alert.alert('Kayıt Başarılı', 'Kullanıcı ekleme başarılı!');
      setCardNumber('');
      setApartmentNumber('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while adding the user.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Kullanıcı Kartı Ekleme Ekranı</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack({ refresh: true })}>
          <Image source={require('./assets/previous.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <Text style={styles.label}>Kart No</Text>
        <TextInput
          style={styles.input}
          value={cardNumber}
          onChangeText={setCardNumber}
          placeholder="Kart Numarası Giriniz"
          placeholderTextColor={"black"}
          keyboardType='numeric'
        />
        <Text style={styles.label}>Daire No</Text>
        <TextInput
          style={styles.input}
          value={apartmentNumber}
          onChangeText={setApartmentNumber}
          placeholder="Daire Numarası Giriniz"
          placeholderTextColor={"black"}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Kart Ekle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4E1",
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#F8F4E1',
    zIndex: 1,
  },
  headerText: {
    fontSize: 20,
    color: "black",
    marginRight: 20,
    fontWeight:"bold",
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80, // to avoid overlapping with header
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 8,
  },
  input: {
    color: "black",
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
    width: '100%',
  },
  button: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddUserForm;