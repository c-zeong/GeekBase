import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef } from 'react';
import { GPU } from '../../types/gpu';
import { Ionicons } from '@expo/vector-icons';
import { GPUSelector } from '../modals/GPUSelector';

const benchmarks = [
  { id: '3dmark', name: '3DMark' },
  { id: 'pixel', name: 'Pixel Rate' },
  { id: 'fp32', name: 'FP32' },
];

interface GPUCompareProps {
  gpuData: GPU[];
}

export const GPUCompare = ({ gpuData }: GPUCompareProps) => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [activeBenchmark, setActiveBenchmark] = useState('3dmark');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const [selectedGPUs, setSelectedGPUs] = useState<[GPU | null, GPU | null]>(() => {
    if (!gpuData) return [null, null];
    
    const defaultGPU1 = gpuData.find(gpu => gpu.gpu_name === 'NVIDIA GeForce RTX 4090');
    const defaultGPU2 = gpuData.find(gpu => gpu.gpu_name === 'AMD Radeon RX 7900 XTX');
    return [defaultGPU1 || null, defaultGPU2 || null];
  });

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    setActiveBenchmark(benchmarks[index].id);
    Animated.spring(slideAnimation, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  const handleGPUSelect = (gpu: GPU) => {
    if (selectedIndex !== null) {
      const newSelectedGPUs = [...selectedGPUs];
      newSelectedGPUs[selectedIndex] = gpu;
      setSelectedGPUs(newSelectedGPUs as [GPU | null, GPU | null]);
    }
  };

  const getPixelRate = (value: string) => {
    return parseFloat(value.replace(' GPixel/s', ''));
  };

  const getFP32 = (value: string) => {
    return parseFloat(value.replace(' TFLOPS', ''));
  };

  const getBenchmarkData = () => {
    if (!selectedGPUs[0] || !selectedGPUs[1]) return null;
  
    const data: any = {
      '3dmark': {
        score: {
          gpu1: Number(selectedGPUs[0].score),
          gpu2: Number(selectedGPUs[1].score),
          maxValue: Math.max(Number(selectedGPUs[0].score), Number(selectedGPUs[1].score))
        }
      },
      'pixel': {
        score: {
          gpu1: getPixelRate(selectedGPUs[0].pixel_rate),
          gpu2: getPixelRate(selectedGPUs[1].pixel_rate),
          maxValue: Math.max(
            getPixelRate(selectedGPUs[0].pixel_rate),
            getPixelRate(selectedGPUs[1].pixel_rate)
          )
        }
      },
      'fp32': {
        score: {
          gpu1: getFP32(selectedGPUs[0].fp32),
          gpu2: getFP32(selectedGPUs[1].fp32),
          maxValue: Math.max(
            getFP32(selectedGPUs[0].fp32),
            getFP32(selectedGPUs[1].fp32)
          )
        }
      }
    };

    return data[activeBenchmark];
  };

  const currentData = getBenchmarkData();

  return (
    <>
      <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
        <View className="p-4">
          {/* 产品选择按钮 */}
          <View className="flex-row justify-between mb-6">
            {[0, 1].map((index) => (
              <TouchableOpacity
                key={index}
                className={`flex-1 mx-2 p-4 rounded-2xl shadow-lg active:scale-95 active:opacity-80 ${
                  isDarkMode 
                    ? index === 0 ? 'bg-[#FBBF24]/10 shadow-[#FBBF24]/20' : 'bg-[#60A5FA]/10 shadow-[#60A5FA]/20'
                    : index === 0 ? 'bg-[#FBBF24]/5 shadow-[#FBBF24]/10' : 'bg-[#60A5FA]/5 shadow-[#60A5FA]/10'
                }`}
                style={{
                  elevation: 3,
                  transform: [{ scale: 1 }]
                }}
                onPress={() => {
                  setSelectedIndex(index);
                  setModalVisible(true);
                }}
              >
                {selectedGPUs[index] ? (
                  <View className="flex-row items-center justify-between">
                    <Text className={`flex-1 text-center font-bold ${
                      index === 0 ? 'text-[#FBBF24]' : 'text-[#60A5FA]'
                    }`}>
                      {selectedGPUs[index]?.gpu_name}
                    </Text>
                    <Ionicons 
                      name="chevron-forward" 
                      size={20} 
                      color={index === 0 ? '#FBBF24' : '#60A5FA'} 
                      style={{ opacity: 0.6 }}
                    />
                  </View>
                ) : (
                  <View className="items-center">
                    <Ionicons 
                      name="add-circle-outline" 
                      size={24} 
                      color={index === 0 ? '#FBBF24' : '#60A5FA'} 
                    />
                    <Text className={`mt-2 ${
                      index === 0 ? 'text-[#FBBF24]' : 'text-[#60A5FA]'
                    }`}>
                      选择显卡
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 性能对比部分 */}
          {currentData && (
            <View className={`mb-4 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-3xl overflow-hidden`}>
              <View className="p-5 border-b border-[#FBBF24]/10">
                <View className="flex-row items-center">
                  <View className="w-1 h-5 bg-[#FBBF24] rounded-full mr-3" />
                  <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    性能对比
                  </Text>
                </View>
              </View>

              <View className="p-4">
                {/* 跑分选项卡 */}
                <View className="relative mb-8">
                  <View className={`flex-row ${isDarkMode ? 'bg-[#222222]' : 'bg-gray-100'} rounded-xl p-1`}>
                    <Animated.View
                      className={`absolute ${isDarkMode ? 'bg-[#2F2F2F]' : 'bg-white'} rounded-lg`}
                      style={{
                        width: '33.33%',
                        top: 4,
                        bottom: 4,
                        transform: [{
                          translateX: slideAnimation.interpolate({
                            inputRange: [0, 1, 2],
                            outputRange: [4, 6 + (100), 8 + (200)],
                          }),
                        }],
                      }}
                    />
                    {benchmarks.map((benchmark, index) => (
                      <TouchableOpacity
                        key={benchmark.id}
                        onPress={() => handleTabPress(index)}
                        className="flex-1 py-3"
                      >
                        <Text className={`text-center ${
                          activeIndex === index 
                            ? 'text-[#FBBF24] font-bold' 
                            : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {benchmark.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* 性能数据 */}
                <View className="space-y-5">
                  <View className="flex-row items-center">
                    <View className="flex-1 h-4 bg-[#FBBF24]/10 rounded-full">
                      <View 
                        className="h-full bg-[#FBBF24] rounded-full" 
                        style={{ width: `${(currentData?.score?.gpu1 / currentData?.score?.maxValue * 100) || 0}%` }} 
                      />
                    </View>
                    <Text className="ml-4 text-base font-medium text-[#FBBF24]">
                      {currentData?.score?.gpu1 || '-'}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="flex-1 h-4 bg-[#60A5FA]/10 rounded-full">
                      <View 
                        className="h-full bg-[#60A5FA] rounded-full" 
                        style={{ width: `${(currentData?.score?.gpu2 / currentData?.score?.maxValue * 100) || 0}%` }} 
                      />
                    </View>
                    <Text className="ml-4 text-base font-medium text-[#60A5FA]">
                      {currentData?.score?.gpu2 || '-'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 规格参数 */}
          {selectedGPUs[0] && selectedGPUs[1] && (
            <View className={`${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-3xl overflow-hidden`}>
              <View className="p-5 border-b border-[#FBBF24]/10">
                <View className="flex-row items-center">
                  <View className="w-1 h-5 bg-[#FBBF24] rounded-full mr-3" />
                  <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    规格参数
                  </Text>
                </View>
              </View>

              <View className="p-4">
                {[
                  { label: '制造商', key: 'foundry' },
                  { label: '架构', key: 'architecture' },
                  { label: '世代', key: 'generation' },
                  { label: '制程', key: 'process_node' },
                  { label: '芯片面积', key: 'die_size' },
                  { label: '基础频率', key: 'base_clock' },
                  { label: '加速频率', key: 'boost_clock' },
                  { label: '显存容量', key: 'memory_size' },
                  { label: '显存类型', key: 'memory_type' },
                  { label: '显存频率', key: 'memory_clock', unit: 'MHz' },
                  { label: '显存位宽', key: 'memory_bus' },
                  { label: '带宽', key: 'bandwidth' },
                  { label: '流处理器', key: 'shading_units' },
                  { label: 'RT核心', key: 'rt_cores' },
                  { label: 'Tensor核心', key: 'tensor_cores' },
                  { label: 'ROPs', key: 'rops' },
                  { label: 'TMUs', key: 'tmus' },
                  { label: '像素填充率', key: 'pixel_rate' },
                  { label: '材质填充率', key: 'texture_rate' },
                  { label: 'FP32性能', key: 'fp32' },
                  { label: 'FP16性能', key: 'fp16' },
                  { label: 'FP64性能', key: 'fp64' },
                  { label: '功耗', key: 'tdp' },
                  { label: '供电接口', key: 'power_connectors' },
                  { label: '发布日期', key: 'release_date' },
                ].map((item) => (
                  <View key={item.key} className="flex-row justify-between mb-3">
                    <Text className={`text-sm font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} style={{ flex: 2 }}>
                      {item.label}
                    </Text>
                    <Text className="text-sm text-[#FBBF24] font-medium" style={{ flex: 3, textAlign: 'right' }}>
                      {`${selectedGPUs[0]?.[item.key as keyof GPU] || '-'}${item.unit || ''}`}
                    </Text>
                    <Text className="text-sm text-[#60A5FA] font-medium" style={{ flex: 3, textAlign: 'right' }}>
                      {`${selectedGPUs[1]?.[item.key as keyof GPU] || '-'}${item.unit || ''}`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <GPUSelector
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleGPUSelect}
        gpuData={gpuData}
      />
    </>
  );
};