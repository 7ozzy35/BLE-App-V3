import React, { useState, useEffect ,route,useCallback,useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, FlatList, Modal } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import { DeviceContext } from './Context/DevicesContext';

const App = ({ navigation }) => {

  const {  myId,setMyId,kartNo, setKartNo,setUserToken,handleDoorOpen,isButtonDisabled } = useContext(DeviceContext);


  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [apartmentNumber, setApartmentNumber] = useState('');
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const fetchUsers = async () => {
    const usersSnapshot = await firestore().collection(myId).get();
    const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersList);
    setFilteredUsers(usersList);
  };

  useFocusEffect(
    useCallback(() => {
      // route objesinin varlığını kontrol et
      if (route && route.params && route.params.refresh) {
        fetchUsers();
      } else {
        fetchUsers(); // params yoksa da veriyi çek
      }
    }, [route?.params?.refresh])
  );
  const handleAddUser = async () => {
    if (name === '' || surname === '' || cardNumber === '' || apartmentNumber === '') {
      Alert.alert('Parametreler boş bırakılamaz!');
      return;
    }

    const newUser = { name, surname, cardNumber, apartmentNumber };

    try {
      const userDoc = await firestore().collection(myId).add(newUser);
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

  const handleEditUser = (index, userCard1, userDaire1) => {
    const user = users[index];

    setCardNumber(userCard1);
    setApartmentNumber(userDaire1);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (editIndex !== null) {
      const user = users[editIndex];
      const updatedUser = {
        "Kart No": cardNumber,
        "Daire No": apartmentNumber
      };

      try {
        await firestore().collection(myId).doc(user.id).update(updatedUser);

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

  // const handleDeleteUser = async () => {
  //   if (editIndex !== null) {
  //     const user = users[editIndex];

  //     try {
  //       await firestore().collection(myId).doc(user.id).delete();
  //       const updatedUsers = users.filter((_, i) => i !== editIndex);
  //       setUsers(updatedUsers);
  //       setFilteredUsers(updatedUsers);
  //       setName('');
  //       setSurname('');
  //       setCardNumber('');
  //       setApartmentNumber('');
  //       setEditIndex(null);
  //       setModalVisible(false);
  //     } catch (error) {
  //       console.error('Error deleting user: ', error);
  //     }
  //   }
  // };

  const handleDeleteUser = async () => {
    if (editIndex !== null) {
      const user = users[editIndex];
  
      try {
        // User'ın deleteItem özelliğini true olarak güncelle
        await firestore()
          .collection(myId)
          .doc(user.id)
          .update({ DeleteItem: true });
  
        // Ekrandaki kullanıcı listesini güncelle
        const updatedUsers = users.map((u, i) =>
          i === editIndex ? { ...u, DeleteItem: true } : u
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
  
        // Input alanlarını temizle ve modalı kapat
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
  const confirmDeleteUser = () => {
    setIsDeleteModalVisible(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const handleSearch = async () => {
    if (searchText === '') {
      setFilteredUsers(users);
      return;
    }

    try {
      const usersSnapshot = await firestore()
        .collection(myId)
        .where('Kart No', '==', searchText)
        .get();

      const filtered = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFilteredUsers(filtered);
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
        <Text style={styles.buttonText}>Kart Ekle</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Kart Numarası girin"
          placeholderTextColor={"black"}
          keyboardType='numeric'
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>ARA</Text>
        </TouchableOpacity>
       
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleClearSearch}>
          <Text style={styles.buttonText}>Arama Sonucunu Sil</Text>
        </TouchableOpacity>

      <View style={styles.resultsHeader}>
        <Text style={[styles.headerText, { fontSize: 15 }]}>Sonuçlar</Text>
        <View style={styles.headerRow}>
          <Text style={[styles.headerDown, { color: '#2E236C', marginRight: 100 }]}>Kart No</Text>
          <Text style={[styles.headerDown, { color: '#2E236C', marginRight: 150 }]}>Daire No</Text>
        </View>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={({ item, index }) => (
          <View style={styles.userContainer}>
            <Text style={styles.userText}>{item["Kart No"]}</Text>
            <Text style={styles.userText}>{item["Daire No"]}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEditUser(index, item["Kart No"], item["Daire No"])}>
              <Text style={styles.buttonText}>Düzenle</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeaderText}>Kullanıcı Düzenle</Text>
            <Text style={styles.currentInfoText}>Mevcut Kart Numarası: {cardNumber}</Text>
            <Text style={styles.currentInfoText}>Mevcut Daire Numarası: {apartmentNumber}</Text>
            <TextInput
              style={styles.modalInput}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="Kart Numarası"
              placeholderTextColor={"black"}
              keyboardType='numeric'
            />
            <TextInput
              style={styles.modalInput}
              value={apartmentNumber}
              onChangeText={setApartmentNumber}
              placeholder="Daire Numarası"
              placeholderTextColor={"black"}
              keyboardType='numeric'
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveEdit}>
              <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={confirmDeleteUser}>
              <Text style={styles.saveButtonText}>Kullanıcıyı Sil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButtonText}>İptal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Kullanıcıyı silmek ister misiniz?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.confirmButton} onPress={() => {
                handleDeleteUser();
                setIsDeleteModalVisible(false);
              }}>
                <Text style={styles.confirmButtonText}>Evet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancelDelete}>
                <Text style={styles.cancelButtonText}>Hayır</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    
    fontWeight: 'bold',
    color: '#2E236C',
  },
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 30,
    height: 30,
  },
  subHeaderText: {
    fontSize: 18,
    color: '#2E236C',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    color:"black",
    borderColor: '#2E236C',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  resultsHeader: {
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerDown: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  userContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    marginBottom: 10,
    borderRadius: 8,
  },
  userText: {
    fontSize: 16,
    color:"black",
  },
  editButton: {
    backgroundColor: '#2E236C',
    padding: 10,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#F8F4E1',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalHeaderText: {
    fontSize: 20,
    color:"black",
    fontWeight: 'bold',
    marginBottom: 10,
  },
  currentInfoText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  modalInput: {
    width: '100%',
    borderColor: '#2E236C',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color:"black",
  },
  saveButton: {
    backgroundColor: '#2E236C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    margin:25,
    marginTop: 20,
    justifyContent: 'center',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#2E236C',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10, // add space between buttons
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10, // add space between buttons
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  }
});

export default App;