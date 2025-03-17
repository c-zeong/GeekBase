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
        
        <View className={`w-full rounded-t-3xl ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
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
            <ScrollView 
              className="max-h-[85vh]"
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              {/* 头部区域 - 更现代的设计 */}
              <View className={`px-6 pt-8 pb-12 ${isDarkMode ? 'bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A]' : 'bg-gradient-to-b from-white to-gray-50'}`}>
                <View className="mb-8">
                  <View className="flex-row items-center mb-2">
                    <View className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FFE600] to-[#FF9900] mr-3" />
                    <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {gpu.brand}
                    </Text>
                  </View>
                  <Text className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {gpu.gpu_name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {gpu.architecture}
                    </Text>
                    <View className="h-1 w-1 rounded-full bg-[#FFE600] mx-2" />
                    <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {gpu.generation}
                    </Text>
                  </View>
                </View>

                {/* 性能指标卡片 */}
                <View className="flex-row space-x-4">
                  {gpu.score && (
                    <View className={`flex-1 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FFE600]/20`}>
                      <Text className="text-[#FFE600] text-xs font-medium mb-1">性能跑分</Text>
                      <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {gpu.score}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">3DMark Time Spy</Text>
                    </View>
                  )}
                  <View className={`flex-1 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FFE600]/20`}>
                    <Text className="text-[#FFE600] text-xs font-medium mb-1">功耗</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {gpu.tdp}W
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">TDP</Text>
                  </View>
                </View>
              </View>

              {/* 规格信息区域 */}
              <View className="p-6 space-y-6">
                <SpecSection title="核心规格" highlight items={[
                  { label: "基础频率", value: gpu.base_clock, highlight: true },
                  { label: "加速频率", value: gpu.boost_clock, highlight: true },
                  { label: "着色单元", value: gpu.shading_units },
                  { label: "光追核心", value: gpu.rt_cores },
                  { label: "张量核心", value: gpu.tensor_cores }
                ]} />

                <SpecSection title="显存规格" items={[
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
                  { label: "制造商", value: gpu.foundry }
                ]} />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

// 新的规格部分组件
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
    <View className={`p-5 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
      <View className="flex-row items-center mb-5">
        {highlight && (
          <View className="w-1 h-5 bg-gradient-to-b from-[#FFE600] to-[#FF9900] rounded-full mr-3" />
        )}
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {title}
        </Text>
      </View>
      <View className="space-y-4">
        {items.map((item, index) => (
          item.value && (
            <View key={index} className="flex-row justify-between items-center">
              <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.label}
              </Text>
              <Text className={`text-base font-medium ${
                item.highlight ? 'text-[#FFE600]' : isDarkMode ? 'text-gray-200' : 'text-gray-700'
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