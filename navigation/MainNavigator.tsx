import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from '../components/screens/Home';
import { New } from '../components/screens/New';
import { Compare } from '../components/screens/Compare';
import { BottomNav } from '../components/BottomNav';
import { Ranking } from '../components/screens/Ranking';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

type RootTabParamList = {
  Home: undefined;
  Compare: undefined;
  Ranking: undefined;
  New: undefined;
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
        component={Home}
      />
      <Tab.Screen 
        name="Compare" 
        component={Compare}
      />
      <Tab.Screen 
        name="Ranking" 
        component={Ranking}
      />
      <Tab.Screen 
        name="New" 
        component={New}
      />
    </Tab.Navigator>
  );
}