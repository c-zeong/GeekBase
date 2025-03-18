import { View, Text, Modal, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { GPU as GPUType } from '../../../types/gpu';
import { useEffect, useRef } from 'react';
import React from 'react';
// import { ScrollView } from 'react-native-gesture-handler';  // 修改 ScrollView 的导入源

interface GPUDetailProps {
  gpu: GPUType | null;
  visible: boolean;
  onClose: () => void;
}

export const GPUDetail = ({ gpu, visible, onClose }: GPUDetailProps) => {
  const { isDarkMode } = useTheme();
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const extractNumber = (value: string | undefined) => {
    if (!value) return undefined;
    const match = value.match(/[\d.]+/);
    return match ? match[0] : undefined;
  };

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnimation, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    } else {
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8
      }).start();
    }
  }, [visible]);

  if (!gpu) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1 bg-black/60">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1" />
        </TouchableWithoutFeedback>
        
        <View className={`w-full rounded-t-3xl overflow-hidden ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
          <Animated.View 
            style={{
              transform: [{
                translateY: slideAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [600, 0]
                })
              }]
            }}
          >
            {/* 固定头部 */}
            <View className={`px-6 pt-6 pb-2 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
              <View className="mb-4">
                <Text className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {gpu.gpu_name}
                </Text>
                <View className="flex-row items-center mt-3">
                  <View className="bg-[#FBBF24]/10 px-3 py-1 rounded-full">
                    <Text className="text-sm text-[#FBBF24] font-medium">
                      {gpu.generation}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {gpu.architecture}
                    </Text>
                  </View>
                </View>
              </View>

              {/* 跑分数据卡片组 */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-6"
              >
                {gpu.score && (
                  <View className={`mr-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FBBF24]/20`}>
                    <Text className="text-[#FBBF24] text-xs font-medium mb-1">3DMark</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {gpu.score}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">Time Spy</Text>
                  </View>
                )}
                {gpu.fp32 && (
                  <View className={`mr-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FBBF24]/20`}>
                    <Text className="text-[#FBBF24] text-xs font-medium mb-1">单精度浮点</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {extractNumber(gpu.fp32)}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">TFLOPS</Text>
                  </View>
                )}
                {gpu.pixel_rate && (
                  <View className={`mr-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FBBF24]/20`}>
                    <Text className="text-[#FBBF24] text-xs font-medium mb-1">像素填充率</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {extractNumber(gpu.pixel_rate)}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">GPixel/s</Text>
                  </View>
                )}
              </ScrollView>
            </View>

            {/* 可滚动的详细参数 */}
            <ScrollView 
              className="max-h-[50vh]"
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              <View className="px-6 pt-0 pb-8">
                <View className="space-y-4">
                  <SpecSection title="核心规格" items={[
                    { label: "基础频率", value: gpu.base_clock, highlight: true },
                    { label: "加速频率", value: gpu.boost_clock, highlight: true },
                    { label: "功耗", value: gpu.tdp?.toString(), highlight: true },
                    { label: "着色单元", value: gpu.shading_units },
                    { label: "光追核心", value: gpu.rt_cores },
                    { label: "张量核心", value: gpu.tensor_cores }
                  ]} />

                  <SpecSection title="计算性能" items={[
                    { label: "FP16", value: gpu.fp16?.toString(), highlight: true },
                    { label: "FP32", value: gpu.fp32?.toString(), highlight: true },
                    { label: "FP64", value: gpu.fp64?.toString(), highlight: true },
                    { label: "像素填充率", value: gpu.pixel_rate?.toString() },
                    { label: "纹理填充率", value: gpu.texture_rate?.toString() }
                  ]} />

                  <SpecSection title="显存规格" highlight items={[
                    { label: "显存容量", value: gpu.memory_size, highlight: true },
                    { label: "显存类型", value: gpu.memory_type },
                    { label: "显存位宽", value: gpu.memory_bus },
                    { label: "显存频率", value: gpu.memory_clock },
                    { label: "带宽", value: gpu.bandwidth, highlight: true }
                  ]} />

                  <SpecSection title="制造工艺" items={[
                    { label: "制程", value: gpu.process_node, highlight: true },
                    { label: "晶体管数量", value: gpu.transistors },
                    { label: "核心面积", value: gpu.die_size },
                    { label: "制造商", value: gpu.foundry, highlight: true }
                  ]} />
                </View>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

// 规格部分组件
const SpecSection = ({ 
  title, 
  items, 
  highlight 
}: { 
  title: string; 
  items: Array<{ label: string; value?: string; highlight?: boolean }>; 
  highlight?: boolean;
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <View className={`p-6 rounded-3xl mb-4 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
      <View className="flex-row items-center mb-6">
        {highlight && (
          <View className="w-1 h-6 bg-gradient-to-b from-[#FBBF24] to-[#FF9900] rounded-full mr-3" />
        )}
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {title}
        </Text>
      </View>
      <View className="space-y-5">
        {items.map((item, index) => (
          item.value && (
            <View key={index} className="flex-row justify-between items-center">
              <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </Text>
              <Text className={`text-base font-medium ${
                item.highlight ? 'text-[#FBBF24]' : isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {item.value}
              </Text>
            </View>
          )
        ))}
      </View>
    </View>
  );
};