import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator();

import Adminf from '../Adminf'
import Admina from '../Admina'
import Home from '../Home'
import User from '../User'
import Onay from '../Onay'



const AppStack = () => {
    return (
        <Stack.Navigator>

            <Stack.Screen name='User' component={User} options={{ headerShown: false }} />
            <Stack.Screen name='adminf' component={Adminf} options={{ headerShown: false }} />
            <Stack.Screen name='Admina' component={Admina} options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={Home} options={{ headerShown: false }} />
            <Stack.Screen name='Onay' component={Onay} options={{ headerShown: false }} />



        </Stack.Navigator>
    )
}

export default AppStack