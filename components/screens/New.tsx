import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NewItemProps {
  date: string;
  year: string;
  products: {
    title: string;
    description: string;
  }[];
}

const NewItem = ({ date, year, products }: NewItemProps) => {
  const { isDarkMode } = useTheme();
  
  return (
    <View className="mb-6">
      <View className="mb-2 flex-row items-baseline">
        <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {date}
        </Text>
        <Text className={`ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {year}
        </Text>
      </View>
      {products.map((product, index) => (
        <View 
          key={index} 
          className={`mb-3 rounded-2xl p-4 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
        >
          <Text className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            {product.title}
          </Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {product.description}
          </Text>
        </View>
      ))}
    </View>
  );
};

export const New = () => {
  const { isDarkMode } = useTheme();
  
  const newProducts = [
    {
      date: '3月18日',
      year: '2024',
      products: [
        {
          title: '小米智能门锁 G500',
          description: '3D结构光人脸识别技术刷脸秒开'
        }
      ]
    },
    {
      date: '3月15日',
      year: '2024',
      products: [
        {
          title: '米家富矿净水器',
          description: '鲜活富矿净水，丰富矿物质含量'
        },
        {
          title: '米家智能桌面鱼缸',
          description: '精巧身型，一体免组装，APP远程喂食'
        }
      ]
    },
    {
      date: '3月12日',
      year: '2024',
      products: [
        {
          title: '米家智能肩颈按摩仪',
          description: '肩颈齐按仿人手推拿，SPA热敷'
        }
      ]
    }
  ];

  return (
    <View className="flex-1">
      <SafeAreaView className={isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}>
        <View className="px-4 py-3">
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            新品
          </Text>
        </View>
      </SafeAreaView>
      <ScrollView 
        className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}
        contentContainerStyle={{ padding: 16 }}
      >
        {newProducts.map((item, index) => (
          <NewItem key={index} {...item} />
        ))}
      </ScrollView>
    </View>
  );
};