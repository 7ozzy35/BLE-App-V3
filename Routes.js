import { View, Text } from 'react-native'
import React,{useContext} from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { Device } from 'react-native-ble-plx'
import { DeviceContext, DeviceProvider } from './Context/DevicesContext'

import AppStack from './Stack/AppStack'
import AuthStack from './Stack/AuthStack'



const Stack = createStackNavigator();
const Routes = () => {

    const { userToken } = useContext(DeviceContext);




    





    return (
        <NavigationContainer>
          
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {userToken ? (
                    console.log("evet userToken var")
                ) : (
                    console.log("hayır bişiyok ")
                )}

                {userToken ? (

                    <Stack.Screen name="App" component={AppStack} />

                ) : (

                    <Stack.Screen name="Auth" component={AuthStack} />


                )}


                {/* DrawerPages */}

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Routes