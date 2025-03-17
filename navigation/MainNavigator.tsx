import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Compare } from '../components/screens/Compare';
import { BottomNav } from '../components/BottomNav';
import { HomeStack } from './HomeStack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

type RootTabParamList = {
  Home: undefined;
  Compare: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  lazy: true
};

export default function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <BottomNav {...props} />}
      screenOptions={screenOptions}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
      />
      <Tab.Screen 
        name="Compare" 
        component={Compare}
      />
    </Tab.Navigator>
  );
}