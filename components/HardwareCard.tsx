import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface HardwareCardProps {
  title: string;
  description: string;
  price: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const HardwareCard = ({ title, description, price, icon }: HardwareCardProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Pressable className={`mb-3 rounded-2xl p-4 ${
      isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'
    }`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {title}
          </Text>
          <Text className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {description}
          </Text>
          <Text className="mt-2 text-base font-bold text-[#FFE600]">
            ¥{price}
          </Text>
        </View>
        <View className={`ml-4 h-12 w-12 items-center justify-center rounded-xl ${
          isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
        }`}>
          <Ionicons name={icon} size={24} color="#FFE600" />
        </View>
      </View>
    </Pressable>
  );
};