import { View, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Header } from '../Header';
import { CategoryGrid } from '../CategoryGrid';
import { LatestProducts } from '../LatestProducts';

export const Home = () => {
  const { isDarkMode } = useTheme();

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
      <ScrollView>
        <Header />
        <LatestProducts />
        <CategoryGrid />
      </ScrollView>
    </View>
  );
};
