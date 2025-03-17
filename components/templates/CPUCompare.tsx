import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { CPU } from '../../types/cpu';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CPUSelector } from '../modals/CPUSelector';

const benchmarks = [
  { id: 'passmark', name: 'PassMark' },
  { id: 'r20', name: 'R20' },
  { id: 'gb6', name: 'GB6' },
];

interface CPUCompareProps {
  cpuData: CPU[];
}

export const CPUCompare = ({ cpuData }: CPUCompareProps) => {
  const { isDarkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [activeBenchmark, setActiveBenchmark] = useState('passmark');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  // 修改初始化逻辑，添加空值检查
  const [selectedCPUs, setSelectedCPUs] = useState<[CPU | null, CPU | null]>(() => {
    if (!cpuData) return [null, null];
    
    const defaultCPU1 = cpuData.find(cpu => cpu.cpu_name === 'Intel Core i9-13900K');
    const defaultCPU2 = cpuData.find(cpu => cpu.cpu_name === 'AMD Ryzen 5 7600X');
    return [defaultCPU1 || null, defaultCPU2 || null];
  });

  // 可以移除这个 useEffect，因为已经在 useState 的初始化函数中处理了
  useEffect(() => {
    if (cpuData && (!selectedCPUs[0] || !selectedCPUs[1])) {
      const defaultCPU1 = cpuData.find(cpu => cpu.cpu_name === 'Intel Core i9-13900K');
      const defaultCPU2 = cpuData.find(cpu => cpu.cpu_name === 'AMD Ryzen 5 7600X');
      setSelectedCPUs([defaultCPU1 || null, defaultCPU2 || null]);
    }
  }, [cpuData]);

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    setActiveBenchmark(benchmarks[index].id);
    Animated.spring(slideAnimation, {
      toValue: index,
      useNativeDriver: true,
    }).start();
  };

  const handleCPUSelect = (cpu: CPU) => {
    if (selectedIndex !== null) {
      const newSelectedCPUs = [...selectedCPUs];
      newSelectedCPUs[selectedIndex] = cpu;
      setSelectedCPUs(newSelectedCPUs as [CPU | null, CPU | null]);
    }
  };

  const getBenchmarkData = () => {
    if (!selectedCPUs[0] || !selectedCPUs[1]) return null;

    const data: any = {
      passmark: {
        singleCore: {
          cpu1: selectedCPUs[0].passmark_s,
          cpu2: selectedCPUs[1].passmark_s,
          maxValue: Math.max(selectedCPUs[0].passmark_s, selectedCPUs[1].passmark_s)
        },
        multiCore: {
          cpu1: selectedCPUs[0].passmark,
          cpu2: selectedCPUs[1].passmark,
          maxValue: Math.max(selectedCPUs[0].passmark, selectedCPUs[1].passmark)
        }
      },
      r20: {
        singleCore: {
          cpu1: selectedCPUs[0].cinebench_r20_single,
          cpu2: selectedCPUs[1].cinebench_r20_single,
          maxValue: Math.max(selectedCPUs[0].cinebench_r20_single, selectedCPUs[1].cinebench_r20_single)
        },
        multiCore: {
          cpu1: selectedCPUs[0].cinebench_r20_multi,
          cpu2: selectedCPUs[1].cinebench_r20_multi,
          maxValue: Math.max(selectedCPUs[0].cinebench_r20_multi, selectedCPUs[1].cinebench_r20_multi)
        }
      },
      gb6: {
        singleCore: {
          cpu1: selectedCPUs[0].geekbench6_single,
          cpu2: selectedCPUs[1].geekbench6_single,
          maxValue: Math.max(selectedCPUs[0].geekbench6_single, selectedCPUs[1].geekbench6_single)
        },
        multiCore: {
          cpu1: selectedCPUs[0].geekbench6_multi,
          cpu2: selectedCPUs[1].geekbench6_multi,
          maxValue: Math.max(selectedCPUs[0].geekbench6_multi, selectedCPUs[1].geekbench6_multi)
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
                className={`flex-1 mx-2 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
                onPress={() => {
                  setSelectedIndex(index);
                  setModalVisible(true);
                }}
              >
                {selectedCPUs[index] ? (
                  <Text className={`text-center font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    {selectedCPUs[index]?.cpu_name}
                  </Text>
                ) : (
                  <View className="items-center">
                    <Ionicons name="add-circle-outline" size={24} color={isDarkMode ? '#fff' : '#000'} />
                    <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      选择处理器
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* 性能对比部分保持不变，但使用新的数据源 */}
          {currentData && (
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
                        <View 
                          className="h-full bg-[#FFE600] rounded-full" 
                          style={{ 
                            width: `${(currentData?.singleCore?.cpu1 / currentData?.singleCore?.maxValue * 100) || 0}%` 
                          }} 
                        />
                      </View>
                      <Text className={`ml-4 text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {currentData?.singleCore?.cpu1 || '-'}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="flex-1 h-4 bg-[#FFE600]/20 rounded-full">
                        <View 
                          className="h-full bg-[#FFE600] rounded-full" 
                          style={{ 
                            width: `${(currentData?.singleCore?.cpu2 / currentData?.singleCore?.maxValue * 100) || 0}%` 
                          }} 
                        />
                      </View>
                      <Text className={`ml-4 text-base font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {currentData?.singleCore?.cpu2 || '-'}
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
                        <View 
                          className="h-full bg-[#FFE600] rounded-full" 
                          style={{ 
                            width: `${(currentData?.multiCore?.cpu1 / currentData?.multiCore?.maxValue * 100) || 0}%` 
                          }} 
                        />
                      </View>
                      <Text className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {currentData?.multiCore?.cpu1 || '-'}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="flex-1 h-3 bg-[#FFE600]/20 rounded-full">
                        <View 
                          className="h-full bg-[#FFE600] rounded-full" 
                          style={{ 
                            width: `${(currentData?.multiCore?.cpu2 / currentData?.multiCore?.maxValue * 100) || 0}%` 
                          }} 
                        />
                      </View>
                      <Text className={`ml-3 font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        {currentData?.multiCore?.cpu2 || '-'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 规格参数 */}
          {selectedCPUs[0] && selectedCPUs[1] && (
            <View className={`p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
              <Text className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                规格参数
              </Text>
              
              {[
                { label: '核心数', key: 'cpu_threads' },
                { label: '核心速度', key: 'total_clock_speed' },
                { label: '睿频倍数', key: 'clock_multiplier' },
                { label: '倍频解锁', key: 'unlocked_multiplier', transform: (value: boolean) => value ? '是' : '否' },
                { label: '制程', key: 'semiconductor_size', unit: 'nm' },
                { label: '功耗', key: 'cpu_tdp', unit: 'W' },
                { label: '晶体管数量', key: 'transistors', unit: 'M' },
                { label: '插槽', key: 'cpu_socket' },
                { label: '芯片组', key: 'compatible_chipsets' },
                { label: '三级缓存', key: 'l3_cache', unit: 'MB' },
                { label: '二级缓存', key: 'l2_cache', unit: 'MB' },
                { label: '一级缓存', key: 'l1_cache', unit: 'KB' },
                { label: '内存类型', key: 'ddr_version', transform: (value: number) => `DDR${value}` },
                { label: '内存通道数', key: 'mem_channels' },
                { label: '最大内存', key: 'max_mem_size', unit: 'GB' },
                { label: '内存频率', key: 'ram_speed_max', unit: 'MHz' },
                { label: '内存带宽', key: 'max_mem_bandwidth', unit: 'GB/s' },
                { label: 'ECC内存支持', key: 'mem_eec', transform: (value: boolean) => value ? '支持' : '不支持' },
                { label: 'PCIe版本', key: 'pcie' },
                { label: '集成显卡', key: 'gpu_name' },
                { label: '显卡加速频率', key: 'gpu_turbo', unit: 'MHz' },
                { label: 'OpenGL', key: 'opengl_version' },
                { label: 'OpenCL', key: 'opencl_version' },
                { label: 'DirectX', key: 'directx_version' },
              ].map((item) => (
                <View key={item.key} className="flex-row justify-between mb-3">
                  <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} style={{ flex: 2 }}>
                    {item.label}
                  </Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'} style={{ flex: 3, textAlign: 'right' }}>
                    {item.transform 
                      ? item.transform(selectedCPUs[0]?.[item.key as keyof CPU] as never)
                      : `${selectedCPUs[0]?.[item.key as keyof CPU] || '-'}${item.unit || ''}`
                    }
                  </Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'} style={{ flex: 3, textAlign: 'right' }}>
                    {item.transform
                      ? item.transform(selectedCPUs[1]?.[item.key as keyof CPU] as never)
                      : `${selectedCPUs[1]?.[item.key as keyof CPU] || '-'}${item.unit || ''}`
                    }
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <CPUSelector
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={handleCPUSelect}
        cpuData={cpuData}
      />
    </>
);
};