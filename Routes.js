import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { DeviceContext } from './Context/DevicesContext';
import Login from './Login';
import SignUp from './SignUp';
import Adminf from './Adminf';
import Admina from './Admina';
import Home from './Home';
import User from './User';
import Onay from './Onay';
import Aktarim from './Aktarim';
import Kurulum from './Kurulum';
import Aktivasyon from './Aktivasyon';

const Stack = createStackNavigator();
const Routes = () => {
  const { userToken, kurulumState } = useContext(DeviceContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {kurulumState === false ? (
          // Eğer kurulumState false ise Kurulum ekranına yönlendirilir
          <Stack.Screen
            name="Kurulum"
            component={Kurulum}
            options={{ headerShown: false }}
          />
        ) : (
          // Eğer kurulumState true ise mevcut yapı çalışır
          <>
            {userToken ? (
              <Stack.Group>
                <Stack.Screen
                  name="User"
                  component={User}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Aktarim"
                  component={Aktarim}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="adminf"
                  component={Adminf}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Admina"
                  component={Admina}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Home"
                  component={Home}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Onay"
                  component={Onay}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
            ) : (
              <Stack.Group initialRouteName="Login">
                <Stack.Screen
                  name="Login"
                  component={Login}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="SignUp"
                  component={SignUp}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="Aktivasyon"
                  component={Aktivasyon}
                  options={{ headerShown: false }}
                />
              </Stack.Group>
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
