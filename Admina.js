import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet, Image, Modal } from 'react-native';

const App = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleAddUser = () => {
    if (cardNumber === '' || apartmentNumber === ''|| name === ''|| surname === '') {
      Alert.alert('Parametreler boş bırakılamaz!');
      return;
    }
    const newUser = { name, surname, cardNumber, apartmentNumber };
    setUsers([...users, newUser]);
    setName('');
    setSurname('');
    setCardNumber('');
    setApartmentNumber('');
  };

  const handleEditUser = (index) => {
    const user = users[index];
    setName(user.name);
    setSurname(user.surname);
    setCardNumber(user.cardNumber);
    setApartmentNumber(user.apartmentNumber);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editIndex] = { name, surname, cardNumber, apartmentNumber };
      setUsers(updatedUsers);
      setName('');
      setSurname('');
      setCardNumber('');
      setApartmentNumber('');
      setEditIndex(null);
      setModalVisible(false);
    }
  };

  const handleDeleteUser = () => {
    if (editIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers.splice(editIndex, 1);
      setUsers(updatedUsers);
      setName('');
      setSurname('');
      setCardNumber('');
      setApartmentNumber('');
      setEditIndex(null);
      setModalVisible(false);
    }
  };

  const handleSearch = () => {
    setSearchModalVisible(false);
    setSearchText(searchText.toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const filteredUsers = users.filter((user) =>
    user.apartmentNumber.toLowerCase().includes(searchText) ||
    user.cardNumber.toLowerCase().includes(searchText)
    ||
    user.name.toLowerCase().includes(searchText)||
    user.surname.toLowerCase().includes(searchText)
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Kullanıcı Yönetim Ekranı</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/previous.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeaderText}>KAYITLI {users.length} KULLANICI VAR</Text>
      <TextInput
        style={styles.input}
        placeholder="KULLANICI ADI-SOYADI"
        placeholderTextColor={'#686D76'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="KULLANICI TELEFON NUMARASI"
        placeholderTextColor={'#686D76'}
        value={surname}
        onChangeText={setSurname}
        keyboardType='phone-pad'
      />
      <TextInput
        style={styles.input}
        placeholder="KULLANICI KARTNO"
        placeholderTextColor={'#686D76'}
        value={cardNumber}
        onChangeText={setCardNumber}
        keyboardType='numeric'
      />
      <TextInput
        style={styles.input}
        placeholder="DAİRE NOSU"
        placeholderTextColor={'#686D76'}
        value={apartmentNumber}
        onChangeText={(text) => setApartmentNumber(text.toLowerCase())}
        keyboardType='numeric'
      />
      <TouchableOpacity style={styles.button} onPress={handleAddUser}>
        <Text style={styles.buttonText}>EKLE</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.searchButton} onPress={() => setSearchModalVisible(true)}>
        <Text style={styles.buttonText}>ARA</Text>
      </TouchableOpacity>
      
      <View style={styles.resultsHeader}>
        <Text style={[styles.header, { color: 'black' }]}>SONUÇLAR</Text>
        {searchText ? (
          <TouchableOpacity style={styles.button} onPress={handleClearSearch}>
            <Text style={styles.buttonText}>Arama Sonucunu Sil</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {filteredUsers.map((user, index) => (
        <View key={index} style={styles.resultItem}>
          <Text style={styles.resultText}>{`${user.name}, ${user.surname}, ${user.cardNumber}, ${user.apartmentNumber}`}</Text>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEditUser(index)}>
            <Text style={styles.editButtonText}>Düzenle</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>KULLANICI ADI</Text>
            <TextInput
              style={styles.modalInput}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>KULLANICI SOYADI</Text>
            <TextInput
              style={styles.modalInput}
              value={surname}
              onChangeText={setSurname}
            />
          </View>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>KULLANICI KARTNO</Text>
            <TextInput
              style={styles.modalInput}
              value={cardNumber}
              onChangeText={setCardNumber}
            />
          </View>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>DAİRE NOSU</Text>
            <TextInput
              style={styles.modalInput}
              value={apartmentNumber}
              onChangeText={(text) => setApartmentNumber(text.toLowerCase())}
            />
          </View>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={handleSaveEdit}>
            <Text style={[styles.saveButtonText]}>Kaydet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 },]} onPress={handleDeleteUser}>
            <Text style={[styles.saveButtonText]}>Sil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={() => setModalVisible(false)}>
            <Text style={[styles.saveButtonText]}>İptal</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={searchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <View style={styles.modalView}>
          <View style={styles.modalInputContainer}>
            <Text style={styles.modalLabel}>Arama Metni</Text>
            <TextInput
              style={styles.modalInput}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={handleSearch}>
            <Text style={[styles.saveButtonText]}>ARA</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={() => setSearchModalVisible(false)}>
            <Text style={styles.cancelButtonText}>İptal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F8F4E1',
  },
  saveButton: {
    backgroundColor: '#134B70',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color:'black',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  button: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  subHeaderText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color:'black',
  },
  input: {
    backgroundColor: '#DFD3C3',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    marginVertical: 10,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color:'black',
  },
  editButton: {
    backgroundColor: '#2E236C',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#667BC6',
    borderRadius: 20,
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
      
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,

  },
  modalLabel: {
    width: 100,
    fontSize: 16,
    color:'black',
  },
  modalInput: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    color:'black',
  },
  clearButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },

});



export default App;
