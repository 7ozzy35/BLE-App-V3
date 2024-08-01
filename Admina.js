import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, FlatList, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = ({ navigation }) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await firestore().collection('Users').get();
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
      setFilteredUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (name === '' || surname === '' || cardNumber === '' || apartmentNumber === '') {
      Alert.alert('Parametreler boş bırakılamaz!');
      return;
    }

    const newUser = { name, surname, cardNumber, apartmentNumber };

    try {
      const userDoc = await firestore().collection('Users').add(newUser);
      const newUserWithId = { id: userDoc.id, ...newUser };
      setUsers([...users, newUserWithId]);
      setFilteredUsers([...users, newUserWithId]);
      setName('');
      setSurname('');
      setCardNumber('');
      setApartmentNumber('');
    } catch (error) {
      console.error('Error adding user: ', error);
    }
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

  const handleSaveEdit = async () => {
    if (editIndex !== null) {
      const user = users[editIndex];
      const updatedUser = {
        name: user.name,
        surname: user.surname,
        cardNumber: cardNumber || user.cardNumber,
        apartmentNumber: apartmentNumber || user.apartmentNumber
      };

      try {
        await firestore().collection('Users').doc(user.id).update(updatedUser);

        const updatedUsers = [...users];
        updatedUsers[editIndex] = { id: user.id, ...updatedUser };
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);

        setCardNumber('');
        setApartmentNumber('');
        setEditIndex(null);
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating user: ', error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (editIndex !== null) {
      const user = users[editIndex];

      try {
        await firestore().collection('Users').doc(user.id).delete();
        const updatedUsers = users.filter((_, i) => i !== editIndex);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setName('');
        setSurname('');
        setCardNumber('');
        setApartmentNumber('');
        setEditIndex(null);
        setModalVisible(false);
      } catch (error) {
        console.error('Error deleting user: ', error);
      }
    }
  };

  const handleSearch = async () => {
    if (searchText === '') {
      setFilteredUsers(users);
      return;
    }

    try {
      const usersSnapshot = await firestore()
        .collection('Users')
        .where('apartmentNumber', '==', searchText)
        .get();

      const filtered = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFilteredUsers(filtered);
      console.log('Filtreli');
    } catch (error) {
      console.error('Error searching users: ', error);
    }
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFilteredUsers(users);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Kullanıcı Yönetim Ekranı</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/previous.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeaderText}>KAYITLI {users.length} KULLANICI VAR</Text>

      <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate("Onay") }}>
        <Text style={styles.buttonText}>Onay Bekleyenler</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Daire numarası girin"
          placeholderTextColor={"black"}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>ARA</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultsHeader}>
        <Text style={[styles.header, { color: 'black' }]}>SONUÇLAR</Text>
        {searchText ? (
          <TouchableOpacity style={styles.clearSearchButton} onPress={handleClearSearch}>
            <Text style={styles.clearButtonText}>Arama Sonucunu Sil</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={[styles.headerDown, { color: '#2E236C' }]}> Daire No / Kart No </Text>
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.user, item.selected && styles.selectedUser]}
            onPress={() => handleEditUser(index)}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.userNumber}>{item["Daire No"]}</Text>
              <Text style={styles.userNumber}>/ {item["Kart No"]}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          {editIndex !== null && (
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderText}>Mevcut Bilgiler</Text>
              <Text style={styles.modalHeaderText}>Daire No: {users[editIndex]["Daire No"]}</Text>
              <Text style={styles.modalHeaderText}>Kart No: {users[editIndex]["Kart No"]}</Text>
            </View>
          )}
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
              onChangeText={setApartmentNumber}
            />
          </View>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={handleSaveEdit}>
            <Text style={[styles.saveButtonText]}>Düzenle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={handleDeleteUser}>
            <Text style={[styles.saveButtonText]}>Kullanıcıyı Sil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={() => setModalVisible(false)}>
            <Text style={[styles.saveButtonText]}>İptal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F4E1',
  },
  saveButton: {
    backgroundColor: '#134B70',
    padding: 10,
    borderRadius: 5,
    width:200,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalHeaderText: {
    fontSize: 20,
    color: 'black',
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 3,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: 300,
    color: 'black',
  },
  modalLabel: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color:'black',
  },
  modalInputContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  modalView: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    rowGap:15,
    borderRadius: 10,
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'black',
  },
  iconButton: {
    position: 'absolute',
    left: 0,
  },
  icon: {
    width: 24,
    height: 24,
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'black',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    color:'black',
  },
  searchButton: {
    backgroundColor: '#2E236C',
    padding: 10,
    borderRadius: 5,
  },
  clearSearchButton: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsHeader: {
    marginBottom: 10,
    alignItems: 'center',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerDown: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  user: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  userNumber: {
    fontSize: 14,
    color: '#333',
  },
  selectedUser: {
    backgroundColor: '#e6e6e6',
  },
});

export default App;
