import React, { useContext,useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TouchableNativeFeedback } from 'react-native';
import { DeviceContext } from './Context/DevicesContext';
import firestore from '@react-native-firebase/firestore';
const App = ({navigation}) => {
  const { sendDeleteCardData,sendCardData,setUserToken,handleDoorOpen,isButtonDisabled } = useContext(DeviceContext);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
          const usersSnapshot = await firestore().collection('Users').get();
          const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log("userlistesi",usersList)
          setUsers(usersList);
          
        };
    
        fetchUsers();
      }, []);


  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Aktarım Sayfası</Text>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Image source={require('./assets/previous.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
     
      <TouchableNativeFeedback
        onPress={()=>{console.log(users),sendCardData(users)}}
        background={TouchableNativeFeedback.Ripple('#FFBF78', true,-20)}
        disabled={isButtonDisabled}
      >
        <View style={styles.buttonAdd}>
          <Text style={styles.buttonText}> Kartları Aktar</Text>
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={()=>{sendDeleteCardData(users)}}
        background={TouchableNativeFeedback.Ripple('#FFBF78', true,-20)}
        disabled={isButtonDisabled}
      >
        <View style={styles.buttonDelete}>
          <Text style={styles.buttonText}> Kartları Sil</Text>
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
  iconButton: {
    padding: 10,
  },
  icon: {
    width: 35,
    height: 35,
    marginHorizontal:10
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

  buttonAdd: {
    position: "absolute",
    bottom: 385,
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
  buttonDelete: {
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
