import {View, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {PermissionsAndroid, Platform} from 'react-native';

import {DeviceContext} from './Context/DevicesContext';
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
import PayTr from './PayTrDeneme';
import Background from './Background';

const Stack = createStackNavigator();

const Routes = () => {
  const {userToken, kurulumState} = useContext(DeviceContext);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 23) {
        try {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ]);

          if (
            granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
            granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
          ) {
            console.log('Location and Bluetooth permissions granted');
            setPermissionsGranted(true);
          } else {
            console.log('Location and/or Bluetooth permissions denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        setPermissionsGranted(true); // Assume permissions are granted on iOS
      }
    };

    requestPermissions();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {kurulumState === false ? (
          // Eğer kurulumState false ise Kurulum ekranına yönlendirilir
          <>
            <Stack.Screen
              name="Kurulum"
              component={Kurulum}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Aktivasyon"
              component={Aktivasyon}
              options={{headerShown: false}}
            />
          </>
        ) : (
          // Eğer kurulumState true ise mevcut yapı çalışır
          <>
            {userToken ? (
              <Stack.Group>
                <Stack.Screen
                  name="Background"
                  component={Background}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="User"
                  component={User}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="Aktarim"
                  component={Aktarim}
                  options={{headerShown: false}}
                />
                <Stack.Screen
                  name="PayTr"
                  component={PayTr}
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
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="SignUp" component={SignUp} />
              </Stack.Group>
            )}
          </>
        )}
      </Stack.Navigator>
      {!permissionsGranted && (
        <View>
          <Text>Please grant the required permissions to use the app.</Text>
        </View>
      )}
    </NavigationContainer>
  );
};

export default Routes;
