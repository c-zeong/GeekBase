import { View, Text, Modal, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { CPU } from '../../../types/cpu';
import { useEffect, useRef } from 'react';
import React from 'react';

interface CPUDetailProps {
  cpu: CPU;
  onClose: () => void;
  visible: boolean;
}

export const CPUDetail = ({ cpu, onClose, visible }: CPUDetailProps) => {
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
              {/* 头部区域 */}
              <View className={`px-6 pt-8 pb-12 ${isDarkMode ? 'bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A]' : 'bg-gradient-to-b from-white to-gray-50'}`}>
                <View className="mb-8">
                  <View className="flex-row items-center mb-2">
                    <View className="h-5 w-5 rounded-full bg-gradient-to-r from-[#FFE600] to-[#FF9900] mr-3" />
                    <Text className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cpu.cpu_type === 'desktop' ? '桌面处理器' : cpu.cpu_type === 'laptop' ? '移动处理器' : '其他处理器'}
                    </Text>
                  </View>
                  <Text className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {cpu.cpu_name}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cpu.cpu_socket || '未知插槽'}
                    </Text>
                    <View className="h-1 w-1 rounded-full bg-[#FFE600] mx-2" />
                    <Text className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cpu.cpu_threads} 线程
                    </Text>
                  </View>
                </View>

                {/* 性能指标卡片 */}
                <View className="flex-row space-x-4">
                  {cpu.passmark && (
                    <View className={`flex-1 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FFE600]/20`}>
                      <Text className="text-[#FFE600] text-xs font-medium mb-1">性能跑分</Text>
                      <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {cpu.passmark}
                      </Text>
                      <Text className="text-xs text-gray-500 mt-1">PassMark</Text>
                    </View>
                  )}
                  <View className={`flex-1 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FFE600]/20`}>
                    <Text className="text-[#FFE600] text-xs font-medium mb-1">功耗</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {cpu.cpu_tdp}W
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">TDP</Text>
                  </View>
                </View>
              </View>

              {/* 规格信息区域 */}
              <View className="p-6 space-y-6">
                <SpecSection title="基本规格" highlight items={[
                  { label: "处理器类型", value: cpu.cpu_type === 'desktop' ? '桌面处理器' : cpu.cpu_type === 'laptop' ? '移动处理器' : '其他处理器' },
                  { label: "处理器插槽", value: cpu.cpu_socket || '未知', highlight: true },
                  { label: "线程数", value: String(cpu.cpu_threads), highlight: true },  // 转换为字符串
                  { label: "制程", value: `${cpu.semiconductor_size}nm` },
                  { label: "解锁倍频", value: cpu.unlocked_multiplier ? '支持' : '不支持' }  // 修改比较
                ]} />

                <SpecSection title="性能参数" items={[
                  { label: "基础频率", value: String(cpu.total_clock_speed), highlight: true },  // 转换为字符串
                  { label: "加速频率", value: String(cpu.turbo), highlight: true },  // 转换为字符串
                  { label: "三级缓存", value: cpu.l3_cache ? `${cpu.l3_cache}MB` : undefined },
                  { label: "二级缓存", value: cpu.l2_cache ? `${cpu.l2_cache}MB` : undefined }
                ]} />

                {(cpu.cinebench_r20_multi || cpu.cinebench_r20_single || cpu.passmark) && (
                  <SpecSection title="跑分信息" items={[
                    { label: "PassMark", value: String(cpu.passmark), highlight: true },  // 转换为字符串
                    { label: "Cinebench R20 多核", value: String(cpu.cinebench_r20_multi) },
                    { label: "Cinebench R20 单核", value: String(cpu.cinebench_r20_single) }
                  ]} />
                )}

                <SpecSection title="内存支持" items={[
                  { label: "内存类型", value: `DDR${cpu.ddr_version}` },
                  { label: "最大内存", value: cpu.max_mem_size ? `${cpu.max_mem_size}GB` : undefined },
                  { label: "内存通道", value: cpu.mem_channels ? `${cpu.mem_channels}通道` : undefined },
                  { label: "最大内存频率", value: cpu.ram_speed_max ? `${cpu.ram_speed_max}MHz` : undefined },
                  { label: "ECC支持", value: cpu.mem_eec ? '支持' : '不支持' }  // 修改比较
                ]} />
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