import { View, Text } from 'react-native'
import React from 'react'
import  Routes  from './Routes'
import { DeviceProvider } from './Context/DevicesContext'
import FlashMessage from 'react-native-flash-message'



const App = () => {


  
  return (
    <DeviceProvider>
      <Routes />
      <FlashMessage
          position="top"
        />
       
    </DeviceProvider>
   
  )
}

export default App