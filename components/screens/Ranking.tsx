import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import { Header } from '../Header';

const categories = [
  { id: 'laptop', name: '笔记本' },
  { id: 'phone', name: '手机' },
  { id: 'ssd', name: '固态硬盘' },
  { id: 'tws', name: 'TWS耳机' },
  { id: 'mouse', name: '鼠标' },
  { id: 'keyboard', name: '键盘' },
];

const laptopData = {
  '3000以下': [
    {
      id: 1,
      name: 'RedmiBook 14 2024',
      price: 2999,
      pros: ['性价比高', '轻薄便携', '续航不错'],
      cons: ['屏幕素质一般', '接口较少'],
    },
    {
      id: 2,
      name: '荣耀 MagicBook X 14',
      price: 2899,
      pros: ['做工扎实', '键盘手感好', '性能稳定'],
      cons: ['散热一般', '扬声器音质普通'],
    },
  ],
  '3000-4000': [
    {
      id: 3,
      name: '联想小新Air 14',
      price: 3699,
      pros: ['屏幕素质好', '性能均衡', '接口丰富'],
      cons: ['续航时间一般', '重量稍重'],
    },
  ],
  '4000-5000': [
    {
      id: 4,
      name: '华硕无畏 Pro 14',
      price: 4599,
      pros: ['2.8K OLED屏幕', '性能强劲', '做工优秀'],
      cons: ['续航一般', '价格偏高'],
    },
  ],
  '5000-7000': [
    {
      id: 5,
      name: '惠普战X',
      price: 5999,
      pros: ['高性能', '屏幕素质好', '接口丰富'],
      cons: ['散热风扇声音大', '价格较高'],
    },
  ],
  '7000-10000': [
    {
      id: 6,
      name: '联想小新Pro 16',
      price: 7999,
      pros: ['大屏高分辨率', '性能强劲', 'RTX显卡'],
      cons: ['便携性差', '续航一般'],
    },
  ],
  '10000以上': [
    {
      id: 7,
      name: 'MacBook Pro 14',
      price: 12999,
      pros: ['M3性能强劲', '续航超长', '屏幕顶级'],
      cons: ['价格昂贵', '接口较少'],
    },
  ],
};

export const Ranking = () => {
  const { isDarkMode } = useTheme();
  const [activeCategory, setActiveCategory] = useState('laptop');

  return (
    <View className="flex-1">
      <View className={`py-12 px-4 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
        <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          榜单
        </Text>
      </View>

      {/* 品类选择器 */}
      <View className={`${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          className="py-4 border-b border-gray-200"
        >
          <View className="flex-row px-4">
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setActiveCategory(category.id)}
                className={`px-5 py-2 ${index !== 0 ? 'ml-6' : ''}`}
              >
                <Text className={`text-base ${
                  activeCategory === category.id
                    ? 'text-[#FFE600] font-bold'
                    : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {category.name}
                </Text>
                {activeCategory === category.id && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFE600] rounded-full" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 榜单内容 */}
      <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
        <View className="p-6 space-y-16">
          {Object.entries(laptopData).map(([priceRange, products]) => (
            <View 
              key={priceRange} 
              className={`p-6 rounded-3xl shadow-lg ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
            >
              <View className="flex-row items-center mb-8">
                <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {priceRange}
                </Text>
                <View className="h-[1px] flex-1 ml-4 bg-gray-200/20" />
              </View>
              <View className="space-y-8">
                {products.map(product => (
                  <View key={product.id} className="flex-row space-x-6">
                    <View className="w-28 h-28 rounded-2xl bg-gray-200/80" />
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {product.name}
                        </Text>
                        <Text className="text-xl text-[#FFE600] font-bold">
                          ¥{product.price}
                        </Text>
                      </View>
                      <View className="space-y-3 mt-3">
                        <View className="flex-row items-start">
                          <Text className="text-green-500 font-medium w-14">优点</Text>
                          <Text className={`flex-1 leading-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {product.pros.join('、')}
                          </Text>
                        </View>
                        <View className="flex-row items-start">
                          <Text className="text-red-500 font-medium w-14">缺点</Text>
                          <Text className={`flex-1 leading-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {product.cons.join('、')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};