import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { CPU as CPUType } from '../../types/cpu';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Animated } from 'react-native';
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
      <SafeAreaView className="bg-gray-100">
        {/* 顶部搜索栏 */}
        <View className="px-4 py-3 flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="w-14 h-14 items-center justify-center rounded-full bg-gray-200"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          
          <View className="flex-1 flex-row items-center h-14 px-4 rounded-full bg-gray-200 ml-4">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              className="flex-1 ml-2 text-base text-black"
              placeholder="搜索CPU型号"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            <TouchableOpacity 
              onPress={() => setSearchText('')}
              className="p-2"
            >
              <Ionicons name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 筛选按钮区域 */}
        <View className="flex-row px-4 py-4 justify-between">
          <TouchableOpacity 
            activeOpacity={1}
            className="w-[30%] py-3.5 px-4 rounded-full bg-white shadow-sm"
            onPress={() => setShowFilterModal('type')}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center mr-1 ${selectedType === 'all' ? 'text-gray-400' : 'text-gray-700'}`}>
                类型
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={14} 
                color={selectedType === 'all' ? '#9CA3AF' : '#374151'} 
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-[30%] py-3.5 px-4 rounded-full bg-white shadow-sm"
            onPress={() => setShowFilterModal('socket')}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center mr-1 ${selectedSocket === 'all' ? 'text-gray-400' : 'text-gray-700'}`}>
                插槽
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={14} 
                color={selectedSocket === 'all' ? '#9CA3AF' : '#374151'} 
              />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-[30%] py-3.5 px-4 rounded-full bg-white shadow-sm"
            onPress={() => setShowFilterModal('tdp')}
          >
            <View className="flex-row items-center justify-center">
              <Text className={`text-center mr-1 ${selectedTdp === 'all' ? 'text-gray-400' : 'text-gray-700'}`}>
                功耗
              </Text>
              <Ionicons 
                name="chevron-down" 
                size={14} 
                color={selectedTdp === 'all' ? '#9CA3AF' : '#374151'} 
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* CPU列表 */}
      <ScrollView className="flex-1 bg-gray-100">
        <View className="p-4">
          {paginatedData.map((cpu: CPUType) => (
            <TouchableOpacity 
              key={cpu._id} 
              className={`mb-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
              onPress={() => setSelectedCpu(cpu)}  // 移除日志输出
            >
              <View className="flex-row justify-between items-start mb-2">
                <Text className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  {cpu.cpu_name}
                </Text>
                {cpu.passmark && (
                  <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
                    <Text className="text-[#FFE600] font-medium">{cpu.passmark}</Text>
                  </View>
                )}
              </View>
              
              <View className="flex-row items-center mb-1">
                <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {cpu.cpu_threads} 线程
                </Text>
                <View className="h-1 w-1 rounded-full bg-gray-400 mx-2" />
                <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {cpu.cpu_tdp}W
                </Text>
                {cpu.cpu_socket && (
                  <>
                    <View className="h-1 w-1 rounded-full bg-gray-400 mx-2" />
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {cpu.cpu_socket}
                    </Text>
                  </>
                )}
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
          <View className={`rounded-t-[30px] ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
            <View className="items-center my-8">
              <Text className={`text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`}>
                {showFilterModal === 'type' ? '处理器类型' : 
                 showFilterModal === 'socket' ? '处理器插槽' : '功耗范围'}
              </Text>
            </View>

            <View className="space-y-4">
              {showFilterModal === 'type' ? (
                [
                  { label: '全部', value: 'all' },
                  { label: '桌面端', value: 'desktop' },
                  { label: '移动端', value: 'laptop' },
                  { label: '其他', value: 'other' }
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-50'
                    } ${selectedType === item.value && 'bg-[#FFE600]/10'}`}
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
                        isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-50'
                      } ${selectedSocket === item.value && 'bg-[#FFE600]/10'}`}
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
                      isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
                    } ${selectedTdp === item.value && 'bg-[#FFE600]/10'}`}
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
