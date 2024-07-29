import { View, Text } from 'react-native'
import React from 'react'
import  Routes  from './Routes'
import { DeviceProvider } from './Context/DevicesContext'

const App = () => {
  return (
    <DeviceProvider>
       <Routes />
    </DeviceProvider>
   
  )
}

export default App