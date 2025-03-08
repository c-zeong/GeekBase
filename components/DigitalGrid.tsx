import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const digitalProducts = [
  { id: 1, title: '手机', icon: 'phone-portrait-sharp' as const },
  { id: 2, title: '笔记本电脑', icon: 'laptop-sharp' as const },
  { id: 3, title: 'TWS耳机', icon: 'headset-sharp' as const },
  { id: 4, title: '鼠标', icon: 'move-sharp' as const },
  { id: 5, title: '键盘', icon: 'keypad-sharp' as const },
];

export const DigitalGrid = () => {
  const { isDarkMode } = useTheme();

  return (
    <View className="px-4 pb-4">
      <View className="flex-row flex-wrap justify-between">
        {digitalProducts.map((product) => (
          <Pressable 
            key={product.id} 
            className={`mb-6 flex-row items-center rounded-2xl p-3 ${
              isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'
            }`}
            style={{ width: '48%' }}>
            <View className={`h-10 w-10 items-center justify-center rounded-xl mr-3 ${
              isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white shadow-sm'
            }`}>
              <Ionicons name={product.icon} size={20} color="#FFE600" />
            </View>
            <Text className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              {product.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};