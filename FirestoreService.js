import firestore from '@react-native-firebase/firestore';

const checkAndAddDocument = async (collectionName, cardNo) => {
  try {
    const collectionRef = firestore().collection(collectionName);
    const querySnapshot = await collectionRef.where('Kart No', '==', cardNo).get();

    if (!querySnapshot.empty) {
      return 'Kart Numarası zaten kayıtlı';
    } else {
      const collectionSnapshot = await collectionRef.get();
      const isCollectionEmpty = collectionSnapshot.empty;
      
      await collectionRef.add({
        'Daire No': '',
        'Kart No': cardNo,
        'Onay': true,
        'Yetki': isCollectionEmpty ? true : false,
      });
      return isCollectionEmpty ? 'Yeni Cihaz Girişi oluşturuldu ve kart numarası yetki ve onay ile eklendi' : 'Kart numarası cihaza kaydedildi oluşturuldu';
    }
  } catch (error) {
    console.error('Error checking or adding document: ', error);
    throw new Error('Bir hata oluştu');
  }
};

export { checkAndAddDocument };
