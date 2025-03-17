import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../components/screens/Home';
import { GPU } from '../components/screens/GPU';
import { CPU } from '../components/screens/CPU';

const Stack = createNativeStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={Home} />
      <Stack.Screen name="GPU" component={GPU} />
      <Stack.Screen name="CPU" component={CPU} />
    </Stack.Navigator>
  );
};