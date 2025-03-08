import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const categories = [
  { id: 1, title: '处理器', icon: 'hardware-chip-sharp' as const },
  { id: 2, title: '显卡', icon: 'speedometer-sharp' as const },
  { id: 3, title: '主板', icon: 'grid-sharp' as const },
  { id: 4, title: '固态硬盘', icon: 'disc-sharp' as const },
  { id: 5, title: '内存条', icon: 'layers-sharp' as const },
];

export const CategoryGrid = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <View className="px-4 pb-4">
      <View className="flex-row flex-wrap justify-between">
        {categories.map((category) => (
          <Pressable 
            key={category.id} 
            className={`mb-6 flex-row items-center rounded-2xl p-3 ${
              isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'
            }`}
            style={{ width: '48%' }}>
            <View className={`h-10 w-10 items-center justify-center rounded-xl mr-3 ${
              isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white shadow-sm'
            }`}>
              <Ionicons name={category.icon} size={20} color="#FFE600" />
            </View>
            <Text className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {category.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};