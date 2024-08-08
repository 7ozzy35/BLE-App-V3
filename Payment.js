import React, { useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

const PaymentScreen = () => {
  const [paymentUrl, setPaymentUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const initiatePayment = async () => {
    
  
    try {
      const response = await axios.post('https://your-server.com/api/paytr-initiate', {
        amount: 10000,
        
      }, {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY', // Eğer gerekiyorsa
          'Content-Type': 'application/json'
        }
      });
  
      if (response.data.status === 'success') {
        setPaymentUrl(response.data.payment_url);
      } else {
        alert('Ödeme başlatılamadı, tekrar deneyin.');
      }
    } catch (error) {
        console.error('Ödeme başlatma hatası:', error.response?.data || error.message);
        alert(`Bir hata oluştu: ${error.response?.status} - ${error.response?.statusText}`);
      }
  
    
  };
  
  

  if (paymentUrl) {
    return (
      <WebView
        source={{ uri: paymentUrl }}
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Ödeme Yap" onPress={initiatePayment} />
      {loading && <ActivityIndicator size="large" />}
    </View>
  );
};

export default PaymentScreen;
