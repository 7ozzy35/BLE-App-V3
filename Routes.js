import {View, Text} from 'react-native';
import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import {Device} from 'react-native-ble-plx';
import {DeviceContext, DeviceProvider} from './Context/DevicesContext';
import Login from './Login';
import SignUp from './SignUp';
import Adminf from './Adminf';
import Admina from './Admina';
import Home from './Home';
import User from './User';
import Onay from './Onay';

const Stack = createStackNavigator();
const Routes = () => {
  const {userToken} = useContext(DeviceContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {userToken
          ? console.log('evet userToken var')
          : console.log('hayır bişiyok ')}

        {userToken ? (
          <Stack.Group>
            <Stack.Screen
              name="User"
              component={User}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="adminf"
              component={Adminf}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Admina"
              component={Admina}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Onay"
              component={Onay}
              options={{headerShown: false}}
            />
          </Stack.Group>
        ) : (
          <Stack.Group initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={Login}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{headerShown: false}}
            />
          </Stack.Group>
        )}

        {/* DrawerPages */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
