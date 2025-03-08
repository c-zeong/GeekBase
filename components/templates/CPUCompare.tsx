import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef } from 'react';

const benchmarks = [
  { id: 'gb6', name: 'GB6' },
  { id: 'cpuz', name: 'CPU-Z' },
  { id: 'r23', name: 'R23' },
];

const benchmarkData = {
  gb6: {
    singleCore: { cpu1: 3200, cpu2: 3100 },
    multiCore: { cpu1: 21000, cpu2: 20500 }
  },
  cpuz: {
    singleCore: { cpu1: 980, cpu2: 950 },
    multiCore: { cpu1: 15800, cpu2: 15200 }
  },
  r23: {
    singleCore: { cpu1: 2900, cpu2: 2850 },
    multiCore: { cpu1: 38000, cpu2: 37500 }
  }
};

export const CPUCompare = () => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [activeBenchmark, setActiveBenchmark] = useState('gb6');

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    setActiveBenchmark(benchmarks[index].id);
    Animated.spring(slideAnimation, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  const currentData = benchmarkData[activeBenchmark as keyof typeof benchmarkData];

  return (
    <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
      <View className="p-4">
        {/* 产品标题 */}
        <View className="flex-row justify-between mb-6">
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            i9-14900K
          </Text>
          <Text className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            7950X3D
          </Text>
        </View>

        {/* 性能对比 */}
        <View className={`p-4 rounded-3xl mb-6 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
          <Text className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            性能对比
          </Text>
          
          {/* 跑分选项卡 */}
          <View className="relative mb-8">
            <View className={`flex-row ${isDarkMode ? 'bg-[#222222]' : 'bg-gray-100'} rounded-xl p-1`}>
              {benchmarks.map((benchmark, index) => (
                <TouchableOpacity
                  key={benchmark.id}
                  onPress={() => handleTabPress(index)}
                  className="flex-1 py-3 z-10"
                >
                  <Text className={`text-center ${
                    activeIndex === index 
                      ? 'text-[#FFE600] font-bold' 
                      : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {benchmark.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Animated.View
              className={`absolute top-1 bottom-1 ${isDarkMode ? 'bg-[#2F2F2F]' : 'bg-white'} rounded-lg shadow w-[33.33%]`}
              style={{
                transform: [{
                  translateX: slideAnimation.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [4, 4 + (100), 4 + (200)],
                  }),
                }],
              }}
            />
          </View>

          {/* 性能数据 */}
          <View className="space-y-12">
            {/* 单核性能 */}
            <View>
              <Text className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                单核性能
              </Text>
              <View className="space-y-5">
                <View className="flex-row items-center">
                  <View className="flex-1 h-4 bg-[#FFE600]/20 rounded-full">
                    <View className="h-full bg-[#FFE600] rounded-full" style={{ width: '80%' }} />
                  </View>
                  <Text className={`ml-4 text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {currentData.singleCore.cpu1}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-1 h-4 bg-[#FFE600]/20 rounded-full">
                    <View className="h-full bg-[#FFE600] rounded-full" style={{ width: '78%' }} />
                  </View>
                  <Text className={`ml-4 text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {currentData.singleCore.cpu2}
                  </Text>
                </View>
              </View>
            </View>

            {/* 多核性能 */}
            <View>
              <Text className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                多核性能
              </Text>
              <View className="space-y-5">
                <View className="flex-row items-center">
                  <View className="flex-1 h-3 bg-[#FFE600]/20 rounded-full">
                    <View className="h-full bg-[#FFE600] rounded-full" style={{ width: '80%' }} />
                  </View>
                  <Text className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {currentData.multiCore.cpu1}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="flex-1 h-3 bg-[#FFE600]/20 rounded-full">
                    <View className="h-full bg-[#FFE600] rounded-full" style={{ width: '78%' }} />
                  </View>
                  <Text className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {currentData.multiCore.cpu2}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 规格参数 */}
        <View className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
          <Text className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
            规格参数
          </Text>
          
          <View className="flex-row justify-between mb-3">
            <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>核心数</Text>
            <Text className={isDarkMode ? 'text-white' : 'text-black'}>24 (8P+16E)</Text>
            <Text className={isDarkMode ? 'text-white' : 'text-black'}>16</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};