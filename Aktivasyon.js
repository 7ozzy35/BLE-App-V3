import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { checkAndAddDocument } from './FirestoreService';

const CheckCardPage = () => {
  const [collectionName, setCollectionName] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckCard = async () => {
    const result = await checkAndAddDocument(collectionName, cardNo);
    setMessage(result);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Bina Adı"
        value={collectionName}
        onChangeText={setCollectionName}
      />
      <TextInput
        style={styles.input}
        placeholder="Kart No"
        value={cardNo}
        onChangeText={setCardNo}
        keyboardType='numeric'
      />
      <Button title="Kart No Kontrol" onPress={handleCheckCard} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'white',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'white',
  },
});

export default CheckCardPage;
