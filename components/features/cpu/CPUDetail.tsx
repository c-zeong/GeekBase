import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { CPU } from '../../../types/cpu';

interface CPUDetailProps {
  cpu: CPU;
  onClose: () => void;
}

export const CPUDetail = ({ cpu, onClose }: CPUDetailProps) => {
  const { isDarkMode } = useTheme();

  return (
    <View className="absolute inset-0 bg-black/50">
      <TouchableOpacity 
        className="absolute inset-0" 
        onPress={onClose}
      />
      
      <View className={`absolute bottom-0 w-full rounded-t-3xl ${
        isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'
      }`}>
        <View className="p-4 border-b border-gray-200/10">
          <View className="flex-row justify-between items-center">
            <Text className={`text-xl font-medium ${
              isDarkMode ? 'text-white' : 'text-black'
            }`}>
              {cpu.cpu_name}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                关闭
              </Text>
            </TouchableOpacity>
          </View>
          
          {cpu.passmark && (
            <View className="mt-2">
              <Text className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                PassMark 跑分
              </Text>
              <Text className="text-[#FFE600] text-2xl font-medium mt-1">
                {cpu.passmark}
              </Text>
            </View>
          )}
        </View>

        <ScrollView className="p-4" style={{ maxHeight: 500 }}>
          <View className="space-y-4">
            {/* 基本信息 */}
            <View className="space-y-2">
              <Text className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>基本信息</Text>
              
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>处理器类型</Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.cpu_type}</Text>
                </View>
                
                <View className="flex-row justify-between">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>处理器插槽</Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.cpu_socket || '未知'}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>功耗</Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.cpu_tdp}W</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>线程数</Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.cpu_threads}</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>制程</Text>
                  <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.semiconductor_size}nm</Text>
                </View>
              </View>
            </View>

            {/* 性能参数 */}
            <View className="space-y-2">
              <Text className={`text-lg font-medium ${
                isDarkMode ? 'text-white' : 'text-black'
              }`}>性能参数</Text>
              
              <View className="space-y-3">
                {cpu.total_clock_speed && (
                  <View className="flex-row justify-between">
                    <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>基础频率</Text>
                    <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.total_clock_speed}GHz</Text>
                  </View>
                )}

                {cpu.turbo && (
                  <View className="flex-row justify-between">
                    <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>加速频率</Text>
                    <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.turbo}GHz</Text>
                  </View>
                )}

                {cpu.l3_cache && (
                  <View className="flex-row justify-between">
                    <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>三级缓存</Text>
                    <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.l3_cache}MB</Text>
                  </View>
                )}

                {cpu.l2_cache && (
                  <View className="flex-row justify-between">
                    <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>二级缓存</Text>
                    <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.l2_cache}MB</Text>
                  </View>
                )}
              </View>
            </View>

            {/* 跑分信息 */}
            {(cpu.cinebench_r20_multi || cpu.cinebench_r20_single || cpu.geekbench6_multi || cpu.geekbench6_single) && (
              <View className="space-y-2">
                <Text className={`text-lg font-medium ${
                  isDarkMode ? 'text-white' : 'text-black'
                }`}>跑分信息</Text>
                
                <View className="space-y-3">
                  {cpu.cinebench_r20_multi && (
                    <View className="flex-row justify-between">
                      <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Cinebench R20 多核</Text>
                      <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.cinebench_r20_multi}</Text>
                    </View>
                  )}

                  {cpu.cinebench_r20_single && (
                    <View className="flex-row justify-between">
                      <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Cinebench R20 单核</Text>
                      <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.cinebench_r20_single}</Text>
                    </View>
                  )}

                  {cpu.geekbench6_multi && (
                    <View className="flex-row justify-between">
                      <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Geekbench 6 多核</Text>
                      <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.geekbench6_multi}</Text>
                    </View>
                  )}

                  {cpu.geekbench6_single && (
                    <View className="flex-row justify-between">
                      <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Geekbench 6 单核</Text>
                      <Text className={isDarkMode ? 'text-white' : 'text-black'}>{cpu.geekbench6_single}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};