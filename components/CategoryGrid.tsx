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
    count: 423,
    icon: 'hardware-chip-sharp' as const, 
    route: 'CPU' as const 
  },
  { 
    id: 2, 
    title: '显卡', 
    subtitle: '最新 GPU 性能排行',
    count: 1456,
    icon: 'speedometer-sharp' as const, 
    route: 'GPU' as const 
  },
];

export const CategoryGrid = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  return (
    <View className={`mx-4 mt-0 mb-6 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-3xl overflow-hidden`}>
      <View className="p-5 border-b border-[#FBBF24]/10">
        <View className="flex-row items-center">
          <View className="w-1 h-5 bg-[#FBBF24] rounded-full mr-3" />
          <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            硬件数据
          </Text>
        </View>
      </View>

      <View className="p-4">
        <View className="flex-row flex-wrap justify-between">
          {categories.map((category) => (
            <Pressable 
              key={category.id} 
              className={`mb-4 p-4 rounded-2xl border-2 border-[#FBBF24]/20 ${
                isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
              }`}
              style={{ width: '48%' }}
              onPress={() => category.route && navigation.navigate(category.route)}
            >
              <View className={`h-12 w-12 items-center justify-center rounded-xl mb-3 bg-[#FBBF24]/10`}>
                <Ionicons 
                  name={category.icon} 
                  size={24} 
                  color="#FBBF24" 
                />
              </View>
              <Text className={`text-[#FBBF24] text-base font-bold mb-1`}>
                {category.title}
              </Text>
              <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-2`}>
                {category.subtitle}
              </Text>
              <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-[10px]`}>
                共收录 <Text className={`text-[#FBBF24]`}>{category.count}</Text> 款
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};