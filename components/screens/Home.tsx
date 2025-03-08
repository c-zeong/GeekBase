import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { HardwareCard } from '../HardwareCard';
import { CategoryGrid } from '../CategoryGrid';
import { Header } from '../Header';
import { DigitalGrid } from '../DigitalGrid';

export const Home = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <View className="flex-1">
      <Header />
      <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
        <View className="p-4">
          {/* 新品上市卡片 */}
          <View className={`mb-4 overflow-hidden rounded-3xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <View className="flex-row items-center justify-between bg-[#FFE600] p-4">
              <Text className="text-lg font-bold text-black">新品上市</Text>
              <Ionicons name="star" size={24} color="#000" />
            </View>
            <View className="p-4">
              <HardwareCard 
                title="RTX 4090" 
                description="英伟达旗舰显卡，性能之王" 
                price="12,999"
                icon="speedometer-sharp"
              />
              <HardwareCard 
                title="AMD 7950X3D" 
                description="游戏性能新标杆" 
                price="4,999"
                icon="hardware-chip-sharp"
              />
              <HardwareCard 
                title="ROG MAXIMUS Z790" 
                description="玩家国度旗舰主板" 
                price="6,999"
                icon="grid-sharp"
              />
            </View>
          </View>

          {/* 硬件DIY卡片 */}
          <View className={`mb-4 overflow-hidden rounded-3xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <View className="flex-row items-center border-l-4 border-[#FFE600] p-4">
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                硬件DIY
              </Text>
            </View>
            <CategoryGrid />
          </View>

          {/* 数码产品卡片 */}
          <View className={`mb-4 overflow-hidden rounded-3xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
            <View className="flex-row items-center border-l-4 border-[#FFE600] p-4">
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                数码产品
              </Text>
            </View>
            <DigitalGrid />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};