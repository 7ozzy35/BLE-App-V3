import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Login from '../Login';
import PinScreen from '../PinScreen';

const AuthStack = () => {
  return (
    <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
            headerShown: false,
            transitionSpec: {
                open: { animation: 'timing', config: { duration: 300 } },
                close: { animation: 'timing', config: { duration: 300 } },
            },
            cardStyleInterpolator: ({ current, next }) => {
              return {
                cardStyle: {
                  opacity: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              };
            }
            
            
        }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name='PinScreen' component={PinScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
