import firestore from '@react-native-firebase/firestore';

const checkAndAddDocument = async (collectionName, cardNo) => {
  try {
    const collectionRef = firestore().collection(collectionName);
    const querySnapshot = await collectionRef.where('Kart No', '==', cardNo).get();

    if (!querySnapshot.empty) {
      // Kart numarası mevcutsa eşleşme başarılı mesajı döndür
      return 'Tüm eşleşmeler başarılı';
    } else {
      // Kart numarası mevcut değilse yeni bir belge ekle
      const collectionSnapshot = await collectionRef.get();
      const isCollectionEmpty = collectionSnapshot.empty;
      
      await collectionRef.add({
        'Daire No': '',
        'Kart No': cardNo,
        'Onay':  true ,
        'Yetki': isCollectionEmpty ? true : false,
      });
      return isCollectionEmpty ? 'Yeni koleksiyon oluşturuldu ve kart numarası yetki ve onay ile eklendi' : 'Kart numarası oluşturuldu';
    }
  } catch (error) {
    console.error('Error checking or adding document: ', error);
    return 'Bir hata oluştu';
  }
};

export { checkAndAddDocument };