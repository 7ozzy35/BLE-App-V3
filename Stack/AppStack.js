import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

import Adminf from '../Adminf';
import Admina from '../Admina';
import Home from '../Home';
import User from '../User';
import Onay from '../Onay';

const AppStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                transitionSpec: {
                    open: { animation: 'timing', config: { duration: 100 } },
                    close: { animation: 'timing', config: { duration: 100 } },
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
            <Stack.Screen name='User' component={User} />
            <Stack.Screen name='adminf' component={Adminf} />
            <Stack.Screen name='Admina' component={Admina} />
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Onay' component={Onay} />
        </Stack.Navigator>
    );
};

export default AppStack;
