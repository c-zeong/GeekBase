import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const tabs = [
  { name: 'Home', label: '首页', icon: 'home' },
  { name: 'Compare', label: '对比', icon: 'bar-chart' }
] as const;

export const BottomNav = ({ state, navigation }: BottomTabBarProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <View className={`flex-row border-t ${
      isDarkMode ? 'bg-[#1A1A1A] border-[#333333]' : 'bg-white border-gray-200'
    }`}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.name}
          className="flex-1 py-2 items-center"
          onPress={() => navigation.navigate(tab.name)}
        >
          <Ionicons
            name={`${tab.icon}${state.index === index ? '' : '-outline'}`}
            size={24}
            color={isDarkMode ? '#fff' : '#000'}
          />
          <Text className={`text-xs mt-1 ${
            isDarkMode ? 'text-white' : 'text-black'
          }`}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};