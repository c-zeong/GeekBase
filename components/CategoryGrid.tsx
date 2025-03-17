import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

const categories = [
  { 
    id: 1, 
    title: '处理器', 
    subtitle: '最新 CPU 性能排行',
    icon: 'hardware-chip-sharp' as const, 
    route: 'CPU' as const 
  },
  { 
    id: 2, 
    title: '显卡', 
    subtitle: '最新 GPU 性能排行',
    icon: 'speedometer-sharp' as const, 
    route: 'GPU' as const 
  },
];

export const CategoryGrid = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View className="px-4 pb-4">
      <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        硬件排行
      </Text>
      <View className="flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <Pressable 
            key={category.id} 
            className={`mb-4 p-4 rounded-2xl ${
              isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
            }`}
            style={{ width: '48%' }}
            onPress={() => category.route && navigation.navigate(category.route)}
          >
            <View className={`h-12 w-12 items-center justify-center rounded-xl mb-3 ${
              isDarkMode ? 'bg-[#333]' : 'bg-gray-50'
            }`}>
              <Ionicons name={category.icon} size={24} color="#FFE600" />
            </View>
            <Text className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {category.title}
            </Text>
            <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {category.subtitle}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};