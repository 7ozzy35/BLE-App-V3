import { View, Text } from 'react-native'
import React from 'react'

import Login from '../Login'
import SignUp from '../SignUp'


import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator();


const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName='Login'>
        
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='SignUp' component={SignUp} options={{ headerShown: false }} />
        
        
      </Stack.Navigator>
  )
}

export default AuthStack