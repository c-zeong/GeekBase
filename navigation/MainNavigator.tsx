import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Compare } from '../components/screens/Compare';
import { BottomNav } from '../components/BottomNav';
import { HomeStack } from './HomeStack';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type RootTabParamList = {
  Home: undefined;
  Compare: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  lazy: true,
  tabBarHideOnKeyboard: true
};

export default function MainNavigator() {
  const { isDarkMode } = useTheme();
  
  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
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
    </View>
  );
}