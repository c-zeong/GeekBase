import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';

const latestProducts = [
  {
    id: 1,
    title: 'Intel Core i9-14900K',
    subtitle: '最新旗舰处理器',
    description: '6.0GHz 睿频 | 32核心 | 125W TDP',
    route: 'CPU' as keyof RootStackParamList,
    icon: 'hardware-chip-sharp' as const,
  },
  {
    id: 2,
    title: 'NVIDIA GeForce RTX 4090',
    subtitle: '最强游戏显卡',
    description: '24GB GDDR6X | 450W TDP',
    route: 'GPU' as keyof RootStackParamList,
    icon: 'speedometer-sharp' as const,
  },
];

export const LatestProducts = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View className="px-4 mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          最新发布
        </Text>
        <TouchableOpacity>
          <Text className="text-[#FFE600]">查看全部</Text>
        </TouchableOpacity>
      </View>
      {latestProducts.map((product) => (
        <TouchableOpacity
          key={product.id}
          className={`mb-4 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
          onPress={() => navigation.navigate(product.route)}
        >
          <View className="flex-row items-center">
            <View className={`h-16 w-16 items-center justify-center rounded-2xl mr-4 ${
              isDarkMode ? 'bg-[#333]' : 'bg-gray-50'
            }`}>
              <Ionicons name={product.icon} size={28} color="#FFE600" />
            </View>
            <View className="flex-1">
              <Text className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {product.title}
              </Text>
              <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.subtitle}
              </Text>
              <Text className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {product.description}
              </Text>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={isDarkMode ? '#666' : '#999'} 
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};