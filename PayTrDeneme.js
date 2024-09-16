import React, {useState} from 'react';
import {View, Button} from 'react-native';
import {WebView} from 'react-native-webview';
import axios from 'axios'; // axios'u ekliyoruz
import {showSuccess} from './Component/helperFunctions';

const PaymentScreen = ({navigation}) => {
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState(''); // WebView URL'si için state tanımlıyoruz

  const handleNavigationChange = navState => {
    const {url} = navState;

    if (url.includes('onay')) {
      // Ödeme başarılı, sayfayı kapat ve geri dön
      setShowWebView(false);
      showSuccess(
        'ödemeniz başarıyla gerçekleşti uygulamanın tadını çıkartın...',
      );
      navigation.goBack();
      // Burada başarılı ödeme ile ilgili işlemler yapabilirsiniz
    } else if (url.includes('fail')) {
      // Ödeme başarısız, sayfayı kapat ve geri dön
      setShowWebView(false);
      // Burada başarısız ödeme ile ilgili işlemler yapabilirsiniz
    }
  };

  const handlePayment = async () => {
    console.log('ödeme başladı');

    try {
      const response = await axios.get('http://192.168.1.182:3200/deneme');

      console.log('res', response);
      const paytrUrl = response.data.paytrUrl; // Backend'den dönen URL

      setWebViewUrl(paytrUrl);
      setShowWebView(true);
      console.log('ödeme başladı2');
    } catch (error) {
      console.error('Payment initiation failed', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Button
        title="Ödemeyi Başlat"
        onPress={handlePayment} // Fonksiyonu doğrudan çağırıyoruz
      />
      {showWebView && (
        <WebView
          source={{uri: webViewUrl}} // Burada webViewUrl state'ini kullanıyoruz
          onNavigationStateChange={handleNavigationChange}
          startInLoadingState={true}
        />
      )}
    </View>
  );
};

export default PaymentScreen;
