import firestore from '@react-native-firebase/firestore';

const checkAndAddOrUpdateDocument = async (collectionName, cardNo) => {
  try {
    const collectionRef = firestore().collection(collectionName);
    const querySnapshot = await collectionRef.where('Kart No', '==', cardNo).get();

    if (querySnapshot.empty) {
      const collectionSnapshot = await collectionRef.get();
      const isCollectionEmpty = collectionSnapshot.empty;

      if (isCollectionEmpty) {
        await collectionRef.add({
          'Daire No': '',
          'Kart No': cardNo,
          'Onay': true,
          'Pay': true,
          'Yetki': true,
        });
        return 'Yeni Cihaz Girişi oluşturuldu ve kart numarası yetki ve onay ile eklendi';
      } else {
        return 'Kart Numarası kayıtlı değil';
      }
    } else {
      const documentRef = querySnapshot.docs[0].ref;
      await documentRef.update({
        'Onay': true,
      });
      return 'Kart Numarası kaydedildi artık giriş yapabilirsin';
    }
  } catch (error) {
    console.error('Error checking or adding/updating document: ', error);
    throw new Error('Bir hata oluştu');
  }
};

export { checkAndAddOrUpdateDocument };
