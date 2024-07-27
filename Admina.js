import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, Modal, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

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

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await firestore().collection('Users').get();
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    if (cardNumber === '' || apartmentNumber === '' || name === '' || surname === '') {
      Alert.alert('Parametreler boş bırakılamaz!');
      return;
    }

    const newUser = { name, surname, cardNumber, apartmentNumber };

    try {
      const userDoc = await firestore().collection('Users').add(newUser);
      setUsers([...users, { id: userDoc.id, ...newUser }]);
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
      const updatedUser = { name, surname, cardNumber, apartmentNumber };

      try {
        await firestore().collection('Users').doc(user.id).update(updatedUser);
        const updatedUsers = [...users];
        updatedUsers[editIndex] = { id: user.id, ...updatedUser };
        setUsers(updatedUsers);
        setName('');
        setSurname('');
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
        const updatedUsers = [...users];
        updatedUsers.splice(editIndex, 1);
        setUsers(updatedUsers);
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

  const handleSearch = () => {
    setSearchModalVisible(false);
    setSearchText(searchText.toLowerCase());
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const filteredUsers = users.filter((user) => {
    const apartmentNum = user.apartmentNumber ? user.apartmentNumber.toLowerCase() : '';
    const cardNum = user.cardNumber ? user.cardNumber.toLowerCase() : '';
    const userName = user.name ? user.name.toLowerCase() : '';
    const userSurname = user.surname ? user.surname.toLowerCase() : '';
    return (
      apartmentNum.includes(searchText) ||
      cardNum.includes(searchText) ||
      userName.includes(searchText) ||
      userSurname.includes(searchText)
    );
  });

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

      <TouchableOpacity style={styles.searchButton} onPress={() => setSearchModalVisible(true)}>
        <Text style={styles.buttonText}>ARA</Text>
      </TouchableOpacity>

      <View style={styles.resultsHeader}>
        <Text style={[styles.header, { color: 'black' }]}>SONUÇLAR</Text>
        <Text style={[styles.headerDown, { color: '#2E236C' }]}>Ad-Soyad   / Daire No   / Kart No   / Tel No</Text>
        {searchText ? (
          <TouchableOpacity style={styles.button} onPress={handleClearSearch}>
            <Text style={styles.buttonText}>Arama Sonucunu Sil</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          item.Onay && (
            <TouchableOpacity
              key={item.id} // Benzersiz bir "key" prop'u ekliyoruz
              style={[styles.user, item.selected && styles.selectedUser]}
              onPress={() => { console.log("tıklandı==>>", item["Ad Soyad"]) }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.userNumber}>{item["Ad Soyad"]}</Text>
                <Text style={styles.userNumber}>/ {item["Daire No"]}</Text>
                <Text style={styles.userNumber}>/ {item["Kart No"]}</Text>
                <Text style={styles.userNumber}>/ {String(item["Telefon No"])}</Text>
              </View>
            </TouchableOpacity>
          )
        )}
      />

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
          <TouchableOpacity style={[styles.saveButton, { marginBottom: 20 }]} onPress={handleDeleteUser}>
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
            <Text style={[styles.cancelButtonText]}>İptal</Text>
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
  },
  cancelButtonText: {
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
    color: 'black',
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
    color: 'black',
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
    borderWidth:2,
    borderBottomColor:"#f0a2f8",
    borderRightColor:"#F8F4E1",
    borderLeftColor:"#F8F4E1",
    borderTopColor:"#F8F4E1"
  },
  headerDown:{
    fontSize: 16,
    marginHorizontal: 15,
    marginVertical:8
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
    color: 'black',
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
    color: 'black',
  },
  modalInput: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    color: 'black',
  },
  clearButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  selectedUser: {
    borderColor: 'blue', // Seçili kartın çerçeve rengi
  },
  userNumber: {
    fontSize: 14,
    marginRight: 10,
    color: "black"
  },
});

export default App;
