import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const navItems = [
  { id: 'home', icon: 'happy-outline' as const, screen: 'Home' },
  { id: 'compare', icon: 'stats-chart-outline' as const, screen: 'Compare' },
  { id: 'ranking', icon: 'list-outline' as const, screen: 'Ranking' },
  { id: 'new', icon: 'star-outline' as const, screen: 'New' },
];

// 删除重复的 tabs 数组，因为已经有 navItems 了
const tabs = [
  { name: 'Home', icon: 'home' },
  { name: 'Compare', icon: 'git-compare' },
  { name: 'Ranking', icon: 'list' },  // Changed from 'Calendar'
  { name: 'New', icon: 'add-circle' },
];

export const BottomNav = ({ state, navigation }: BottomTabBarProps) => {
  const { isDarkMode } = useTheme();

  return (
    <View className="absolute bottom-4 left-16 right-16">
      <View className={`flex-row items-center justify-between rounded-[32px] py-2 border ${
        isDarkMode ? 'bg-[#2A2A2A] border-white/20' : 'bg-white border-black/10'
      }`}>
        {navItems.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={() => navigation.navigate(item.screen)}
            className={`items-center justify-center rounded-full p-3 mx-2 ${
              state.index === index ? 'bg-[#FFE600]' : ''
            }`}>
            <Ionicons 
              name={item.icon} 
              size={20} 
              color={state.index === index ? '#000000' : isDarkMode ? '#FFFFFF' : '#333333'} 
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
};