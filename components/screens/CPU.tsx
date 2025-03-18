import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { CPU as CPUType } from '../../types/cpu';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { CPUDetail } from '../features/cpu/CPUDetail';

export const CPU = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSocket, setSelectedSocket] = useState('all');
  const [selectedTdp, setSelectedTdp] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState<string | null>(null);
  const [selectedCpu, setSelectedCpu] = useState<CPUType | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  // 添加动画效果控制
  useEffect(() => {
    if (showFilterModal) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showFilterModal]);
  const [cpuData, setCpuData] = useState<CPUType[]>([]);
  const [filteredData, setFilteredData] = useState<CPUType[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // 加载数据
  useEffect(() => {
    const loadCPUData = async () => {
      try {
        const csvFile = require('../../assets/cpu.csv');
        const asset = await Asset.fromModule(csvFile).downloadAsync();
        
        if (!asset.localUri) {
          throw new Error('Failed to load CSV file');
        }
        
        const csvText = await FileSystem.readAsStringAsync(asset.localUri);
        
        Papa.parse<CPUType>(csvText, {
          header: true,
          skipEmptyLines: true, // 跳过空行
          transform: (value) => value.trim(), // 清理每个值的空白字符
          complete: (results) => {
            if (results.data) {
              // 过滤掉不完整的数据
              const validData = results.data.filter(row => 
                row._id && 
                row.cpu_name && 
                row.cpu_type
              );
              setCpuData(validData);
            }
            if (results.errors.length > 0) {
              console.warn('CSV parsing warnings:', results.errors);
            }
          }
        });
      } catch (error) {
        console.error('Error loading CPU data:', error);
      }
    };

    loadCPUData();
  }, []);

  // 筛选逻辑
  useEffect(() => {
    let filtered = cpuData;

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(cpu => 
        cpu.cpu_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 类型筛选
    if (selectedType !== 'all') {
      filtered = filtered.filter(cpu => cpu.cpu_type === selectedType);
    }

    // 插槽筛选
    if (selectedSocket !== 'all') {
      filtered = filtered.filter(cpu => cpu.cpu_socket === selectedSocket);
    }

    // 功耗筛选
    if (selectedTdp !== 'all') {
      filtered = filtered.filter(cpu => {
        const tdp = parseInt(cpu.cpu_tdp) || 0;
        switch (selectedTdp) {
          case 'under50':
            return tdp < 50;
          case '50to80':
            return tdp >= 50 && tdp < 80;
          case '80to120':
            return tdp >= 80 && tdp < 120;
          case '120to160':
            return tdp >= 120 && tdp < 160;
          case '160to200':
            return tdp >= 160 && tdp < 200;
          case '200to300':
            return tdp >= 200 && tdp < 300;
          case 'above300':
            return tdp >= 300;
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
    setPage(1);
  }, [searchText, selectedType, selectedSocket, selectedTdp, cpuData]);

  // 分页数据
  const paginatedData = filteredData.slice(0, page * itemsPerPage);
  const hasMore = paginatedData.length < filteredData.length;

  // 获取所有可用的插槽选项
  const availableSockets = Array.from(new Set(cpuData.map(cpu => cpu.cpu_socket))).filter(Boolean);

  return (
    <View className="flex-1">
      <SafeAreaView className={`${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
        {/* 顶部搜索栏 */}
        <View className="px-4 py-3 flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className={`w-14 h-14 items-center justify-center rounded-full ${
              isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-200'
            }`}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={isDarkMode ? '#fff' : '#333'} 
            />
          </TouchableOpacity>
          
          <View className={`flex-1 flex-row items-center h-14 px-4 rounded-full ml-4 ${
            isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-200'
          }`}>
            <Ionicons 
              name="search" 
              size={20} 
              color={isDarkMode ? '#666' : '#666'} 
            />
            <TextInput
              className={`flex-1 ml-2 text-base ${isDarkMode ? 'text-white' : 'text-black'}`}
              placeholder="搜索CPU型号"
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            <TouchableOpacity 
              onPress={() => setSearchText('')}
              className="p-2"
            >
              <Ionicons 
                name="close" 
                size={18} 
                color={isDarkMode ? '#666' : '#666'} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 筛选按钮区域 */}
        <View className="flex-row px-4 py-2 justify-between">
          <TouchableOpacity 
            activeOpacity={1}
            className={`w-[30%] py-3.5 px-4 rounded-full ${
              isDarkMode 
                ? selectedType !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                : selectedType !== 'all' ? 'bg-white' : 'bg-white'
            } shadow-sm`}
            onPress={() => setShowFilterModal('type')}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center mr-1 ${
                selectedType !== 'all'
                  ? isDarkMode ? 'text-[#FFE600] font-medium' : 'text-gray-900 font-medium'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                类型
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={14} 
                color={selectedType === 'all' 
                  ? isDarkMode ? '#9CA3AF' : '#9CA3AF'
                  : isDarkMode ? '#FFE600' : '#111827'
                } 
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`w-[30%] py-3.5 px-4 rounded-full ${
              isDarkMode 
                ? selectedSocket !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                : selectedSocket !== 'all' ? 'bg-white' : 'bg-white'
            } shadow-sm`}
            onPress={() => setShowFilterModal('socket')}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center mr-1 ${
                selectedSocket !== 'all'
                  ? isDarkMode ? 'text-[#FFE600] font-medium' : 'text-gray-900 font-medium'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                插槽
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={14} 
                color={selectedSocket === 'all' 
                  ? isDarkMode ? '#9CA3AF' : '#9CA3AF'
                  : isDarkMode ? '#FFE600' : '#111827'
                } 
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`w-[30%] py-3.5 px-4 rounded-full ${
              isDarkMode 
                ? selectedTdp !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                : selectedTdp !== 'all' ? 'bg-white' : 'bg-white'
            } shadow-sm`}
            onPress={() => setShowFilterModal('tdp')}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center mr-1 ${
                selectedTdp !== 'all'
                  ? isDarkMode ? 'text-[#FFE600] font-medium' : 'text-gray-900 font-medium'
                  : isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                功耗
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={14} 
                color={selectedTdp === 'all' 
                  ? isDarkMode ? '#9CA3AF' : '#9CA3AF'
                  : isDarkMode ? '#FFE600' : '#111827'
                } 
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* CPU列表 */}
      <ScrollView 
        className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}
        keyboardShouldPersistTaps="handled"
      >
        <View className="p-4">
          {paginatedData.map((cpu: CPUType) => (
            <TouchableOpacity 
              key={cpu._id} 
              className={`mb-4 p-4 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-2xl shadow-sm`}
              onPress={() => setSelectedCpu(cpu)}
            >
              {/* CPU 名称和性能分数 */}
              <View className="flex-row items-start justify-between mb-4">
                <Text className={`text-lg font-semibold flex-1 mr-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {cpu.cpu_name}
                </Text>
                {cpu.passmark && (
                  <View className="shrink-0 px-3 py-1.5 bg-[#FBBF24]/10 rounded-lg">
                    <Text className="text-[#FBBF24] font-bold text-sm">
                      {cpu.passmark}
                    </Text>
                  </View>
                )}
              </View>

              {/* CPU 规格信息 */}
              <View>
                {/* 参数卡片 */}
                <View className="flex-row justify-between">
                  {/* 大核 */}
                  {cpu.total_clock_speed?.includes('&') ? (
                    cpu.total_clock_speed.split('&').map((part, index) => {
                      if (index === 0) {
                        const [count, speed] = part.trim().split('x').map(s => s.trim());
                        return (
                          <View key={index} className={`w-[23%] p-3 rounded-xl ${isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'}`}>
                            <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              大核
                            </Text>
                            <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              {`${count}×${speed}`}
                            </Text>
                          </View>
                        );
                      }
                      return null;
                    })
                  ) : (
                    <View className={`w-[23%] p-3 rounded-xl ${isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'}`}>
                      <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        纯大核
                      </Text>
                      <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {cpu.total_clock_speed?.includes('x') ? (
                          (() => {
                            const [count, speed] = cpu.total_clock_speed.split('x').map(s => s.trim());
                            return `${count}×${speed}`;
                          })()
                        ) : (
                          `${cpu.cpu_cores}×${cpu.total_clock_speed}`
                        )}
                      </Text>
                    </View>
                  )}

                  {/* 小核 */}
                  {cpu.total_clock_speed?.includes('&') ? (
                    cpu.total_clock_speed.split('&').map((part, index) => {
                      if (index === 1) {
                        const [count, speed] = part.trim().split('x').map(s => s.trim());
                        return (
                          <View key={index} className={`w-[23%] p-3 rounded-xl ${isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'}`}>
                            <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              小核
                            </Text>
                            <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              {`${count}×${speed}`}
                            </Text>
                          </View>
                        );
                      }
                      return null;
                    })
                  ) : null}

                  {/* 其他参数卡片 */}
                  {[
                    {
                      title: '线程数',
                      value: cpu.cpu_threads,
                      unit: ''
                    },
                    {
                      title: '制程',
                      value: cpu.semiconductor_size,
                      unit: 'nm'
                    },
                    {
                      title: '功耗',
                      value: cpu.cpu_tdp,
                      unit: 'W'
                    }
                  ].slice(0, cpu.total_clock_speed?.includes('&') ? 2 : 3).map((item, index) => (
                    <View key={index} className={`w-[23%] p-3 rounded-xl ${isDarkMode ? 'bg-[#333333]' : 'bg-gray-50'}`}>
                      <Text className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.title}
                      </Text>
                      <Text className={`text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {`${item.value}${item.unit}`}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {hasMore && (
            <TouchableOpacity 
              onPress={() => setPage(prev => prev + 1)}
              className={`py-3 rounded-xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
            >
              <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                加载更多
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* 筛选弹窗 */}
      <Modal
        visible={!!showFilterModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowFilterModal(null)}
      >
        <View className="flex-1 justify-end">
          <Animated.View 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'black',
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5]
              })
            }}
          >
            <TouchableOpacity 
              className="flex-1"
              onPress={() => setShowFilterModal(null)}
            />
          </Animated.View>
          <View className={`rounded-t-3xl ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
            <View className="items-center my-8">
              <Text className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                {showFilterModal === 'type' ? '处理器类型' : 
                 showFilterModal === 'socket' ? '处理器插槽' : '功耗范围'}
              </Text>
            </View>

            {/* 增加左右内边距 */}
            <View className="space-y-4 px-6 pb-8">
              {showFilterModal === 'type' ? (
                [
                  { label: '全部', value: 'all' },
                  { label: '桌面端', value: 'desktop' },
                  { label: '移动端', value: 'laptop' },
                  { label: '掌机', value: 'other' }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      selectedType === item.value ? (
                        isDarkMode ? 'bg-[#FFE600]/10' : 'bg-[#FFE600]/5'
                      ) : ''
                    }`}
                    onPress={() => {
                      setSelectedType(item.value);
                      setShowFilterModal(null);
                    }}
                  >
                    <Text className={`text-base font-medium ${
                      selectedType === item.value
                        ? 'text-[#FFE600]'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {item.label}
                    </Text>
                    {selectedType === item.value && (
                      <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                    )}
                  </TouchableOpacity>
                ))
              ) : showFilterModal === 'socket' ? (
                <View className="flex-row flex-wrap justify-between">
                  {[
                    { label: '全部', value: 'all' },
                    ...availableSockets.map(socket => ({
                      label: socket.toUpperCase(),
                      value: socket
                    }))
                  ].map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      className={`w-[48%] mb-4 p-4 rounded-xl ${
                        isDarkMode 
                          ? selectedSocket === item.value 
                            ? 'bg-[#FFE600]/10' 
                            : 'bg-[#2A2A2A]'
                          : selectedSocket === item.value
                            ? 'bg-[#FFE600]/10'
                            : 'bg-gray-50'
                      }`}
                      onPress={() => {
                        setSelectedSocket(item.value);
                        setShowFilterModal(null);
                      }}
                    >
                      <View className="flex-row items-center justify-between">
                        <Text className={`text-base font-medium ${
                          selectedSocket === item.value
                            ? 'text-[#FFE600]'
                            : isDarkMode ? 'text-gray-300' : 'text-gray-500'
                        }`}>
                          {item.label}
                        </Text>
                        {selectedSocket === item.value && (
                          <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                [
                  { label: '全部', value: 'all' },
                  { label: '50W 以下', value: 'under50' },
                  { label: '50W - 80W', value: '50to80' },
                  { label: '80W - 120W', value: '80to120' },
                  { label: '120W - 160W', value: '120to160' },
                  { label: '160W - 200W', value: '160to200' },
                  { label: '200W - 300W', value: '200to300' },
                  { label: '300W 以上', value: 'above300' }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      selectedTdp === item.value ? (
                        isDarkMode ? 'bg-[#FFE600]/10' : 'bg-[#FFE600]/5'
                      ) : ''
                    }`}
                    onPress={() => {
                      setSelectedTdp(item.value);
                      setShowFilterModal(null);
                    }}
                  >
                    <Text className={`text-base ${
                      selectedTdp === item.value
                        ? 'text-[#FFE600]'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </Text>
                    {selectedTdp === item.value && (
                      <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* CPU 详情弹窗 */}
      {selectedCpu && (
        <CPUDetail 
          cpu={selectedCpu} 
          onClose={() => setSelectedCpu(null)} 
          visible={!!selectedCpu}  // 添加 visible 属性
        />
      )}
    </View>
  );
};
