import { View, Text, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const latestProducts = [
  {
    id: 1,
    title: 'AMD Ryzen 9 9800X3D',
    subtitle: '次世代3D V-Cache旗舰',
    params: [
      { label: '核心数', value: '16核32线程' },
      { label: '三级缓存', value: '144MB' },
      { label: '加速频率', value: '5.4GHz' },
      { label: '功耗', value: '170W' }
    ],
    image: require('../assets/images/9800x3d.png'),
    gradient: ['#4F46E5', '#6366F1'] as const,
  },
  {
    id: 2,
    title: 'NVIDIA GeForce RTX 5090',
    subtitle: '突破性能极限',
    params: [
      { label: 'CUDA核心', value: '24576' },
      { label: '显存', value: '32GB GDDR7' },
      { label: '光追核心', value: '4代' },
      { label: '功耗', value: '800W' }
    ],
    image: require('../assets/images/rtx5090.jpg'),
    gradient: ['#4F46E5', '#6366F1'] as const,
  }
];

export const LatestProducts = () => {
  const { isDarkMode } = useTheme();

  return (
    <View className={`mx-4 mt-6 mb-6 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-3xl overflow-hidden`}>
      <View className="p-5 border-b border-[#FBBF24]/10">
        <View className="flex-row items-center">
          <View className="w-1 h-5 bg-[#FBBF24] rounded-full mr-3" />
          <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            热销新品
          </Text>
        </View>
      </View>

      <View className="px-2 py-6">
        {latestProducts.map((product) => (
          <View
            key={product.id}
            className={`p-4 rounded-2xl border-2 border-[#FBBF24]/20 ${
              isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
            } mb-4 last:mb-2`}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <Text className={`text-[#FBBF24] text-base font-bold mb-1`}>
                  {product.title}
                </Text>
                <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs mb-3`}>
                  {product.subtitle}
                </Text>
                <View className="flex-row items-center flex-wrap">
                  {product.params.slice(0, 3).map((param, index) => (
                    <View key={index} className="flex-row items-center">
                      <View>
                        <Text className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-[10px] mb-0.5`}>
                          {param.label}
                        </Text>
                        <Text className={`${isDarkMode ? 'text-white' : 'text-black'} text-xs font-medium`}>
                          {param.value}
                        </Text>
                      </View>
                      {index < 2 && (
                        <View className={`h-8 w-[1px] mx-3 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                      )}
                    </View>
                  ))}
                </View>
              </View>
              <Image 
                source={product.image}
                className="w-20 h-20 rounded-xl ml-4"
                resizeMode="cover"
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};