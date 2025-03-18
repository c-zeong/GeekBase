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
                  {cpu.cpu_name}
                </Text>
                <Text className={`text-base mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {cpu.cpu_socket?.toUpperCase() || '未知插槽'}
                </Text>
              </View>

              {/* 跑分数据卡片组 */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-2"
              >
                {cpu.passmark && (
                  <View className={`mr-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FBBF24]/20`}>
                    <Text className="text-[#FBBF24] text-xs font-medium mb-1">PassMark</Text>
                    <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      {cpu.passmark}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">综合性能</Text>
                  </View>
                )}
                {cpu.cinebench_r20_multi && (
                  <View className={`mr-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FBBF24]/20`}>
                    <Text className="text-[#FBBF24] text-xs font-medium mb-1">Cinebench R20</Text>
                    <View className="flex-row items-baseline">
                      <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {cpu.cinebench_r20_multi}
                      </Text>
                      {cpu.cinebench_r20_single && (
                        <Text className={`text-sm ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cpu.cinebench_r20_single}
                        </Text>
                      )}
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">多核/单核</Text>
                  </View>
                )}
                {cpu.geekbench6_multi && (
                  <View className={`mr-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} border border-[#FBBF24]/20`}>
                    <Text className="text-[#FBBF24] text-xs font-medium mb-1">Geekbench 6</Text>
                    <View className="flex-row items-baseline">
                      <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {cpu.geekbench6_multi}
                      </Text>
                      {cpu.geekbench6_single && (
                        <Text className={`text-sm ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {cpu.geekbench6_single}
                        </Text>
                      )}
                    </View>
                    <Text className="text-xs text-gray-500 mt-1">多核/单核</Text>
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
                  <SpecSection title="基本规格" items={[
                    { label: "处理器类型", value: cpu.cpu_type === 'desktop' ? '桌面处理器' : cpu.cpu_type === 'laptop' ? '移动处理器' : '其他处理器' },
                    { label: "制程", value: cpu.semiconductor_size ? `${cpu.semiconductor_size}nm` : undefined, highlight: true },
                    { label: "功耗", value: cpu.cpu_tdp ? `${cpu.cpu_tdp}W` : undefined, highlight: true },
                    { label: "晶体管数量", value: cpu.transistors ? `${cpu.transistors}亿` : undefined },
                    { label: "解锁倍频", value: cpu.unlocked_multiplier ? '支持' : '不支持' }
                  ]} />

                  <SpecSection title="性能参数" items={[
                    { label: "核心数", value: cpu.cpu_threads ? `${cpu.cpu_threads}核心` : undefined, highlight: true },
                    { label: "基础频率", value: cpu.total_clock_speed, highlight: true },
                    { label: "加速频率", value: cpu.turbo?.toString(), highlight: true },
                    { label: "倍频", value: cpu.clock_multiplier?.toString() },
                    { label: "三级缓存", value: cpu.l3_cache ? `${cpu.l3_cache}MB` : undefined },
                    { label: "二级缓存", value: cpu.l2_cache ? `${cpu.l2_cache}MB` : undefined },
                    { label: "一级缓存", value: cpu.l1_cache?.toString() }
                  ]} />

                  <SpecSection title="内存支持" items={[
                    { label: "内存类型", value: cpu.ddr_version ? `DDR${cpu.ddr_version}` : undefined },
                    { label: "最大带宽", value: cpu.max_mem_bandwidth ? `${cpu.max_mem_bandwidth}GB/s` : undefined },
                    { label: "最大频率", value: cpu.ram_speed_max ? `${cpu.ram_speed_max}MHz` : undefined },
                    { label: "内存通道", value: cpu.mem_channels?.toString() },
                    { label: "最大容量", value: cpu.max_mem_size ? `${cpu.max_mem_size}GB` : undefined, highlight: true },
                    { label: "ECC支持", value: cpu.mem_eec ? '支持' : '不支持' }
                  ]} />
                  {cpu.int_graphics && (
                    <SpecSection title="集成显卡" items={[
                      { label: "显卡型号", value: cpu.gpu_name, highlight: true },
                      { label: "显卡频率", value: cpu.gpu_turbo?.toString() },
                      { label: "OpenGL", value: cpu.opengl_version },
                      { label: "OpenCL", value: cpu.opencl_version },
                      { label: "DirectX", value: cpu.directx_version }
                    ]} />
                  )}

                  {cpu.compatible_chipsets && (
                    <SpecSection title="其他参数" items={[
                      { label: "PCIe", value: cpu.pcie?.toString() },
                      { label: "芯片组", value: cpu.compatible_chipsets }
                    ]} />
                  )}
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
  items: Array<{ 
    label: string; 
    value: string | undefined; 
    highlight?: boolean; 
  }>; 
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