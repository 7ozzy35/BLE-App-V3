import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Login from './Login'
import User from './User'
import { Device } from 'react-native-ble-plx'
import { DeviceProvider } from './Context/DevicesContext'
import Adminf from './Adminf'
import Admina from './Admina'
import Home from './Home'


const Stack = createStackNavigator();


const routes = () => {
  return (
    <NavigationContainer> 
        <DeviceProvider>
        <Stack.Navigator initialRouteName='LoginTab'>
        
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='User' component={User} options={{ headerShown: false }} />
        <Stack.Screen name='adminf' component={Adminf} options={{ headerShown: false }} />
        <Stack.Screen name='Admina' component={Admina} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />


        
      </Stack.Navigator>
      </DeviceProvider>
    </NavigationContainer>
  )
}

export default routes