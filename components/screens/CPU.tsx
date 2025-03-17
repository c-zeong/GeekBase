import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { CPU as CPUType } from '../../types/cpu';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
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
      <SafeAreaView className={isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}>
        {/* 顶部搜索栏 */}
        <View className="px-4 py-2 flex-row items-center space-x-3">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
          
          <View className={`flex-1 flex-row items-center px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-100'}`}>
            <Ionicons name="search-outline" size={18} color={isDarkMode ? '#666' : '#999'} />
            <TextInput
              className={`flex-1 ml-2 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
              placeholder="搜索处理器"
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText ? (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Ionicons name="close-circle" size={16} color={isDarkMode ? '#666' : '#999'} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* 筛选按钮区域 */}
        <View className="flex-row px-4 py-4 space-x-6">
          <TouchableOpacity 
            className={`flex-1 py-2.5 px-4 rounded-xl ${
              isDarkMode 
                ? selectedType !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                : selectedType !== 'all' ? 'bg-[#FFE600]/5' : 'bg-gray-50'
            }`}
            onPress={() => setShowFilterModal('type')}
          >
            <Text className={`text-center ${
              selectedType !== 'all'
                ? 'text-[#FFE600] font-medium'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              分类 {selectedType !== 'all' && '•'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2.5 px-4 rounded-xl ${
              isDarkMode 
                ? selectedSocket !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                : selectedSocket !== 'all' ? 'bg-[#FFE600]/5' : 'bg-gray-50'
            }`}
            onPress={() => setShowFilterModal('socket')}
          >
            <Text className={`text-center ${
              selectedSocket !== 'all'
                ? 'text-[#FFE600] font-medium'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              插槽 {selectedSocket !== 'all' && '•'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className={`flex-1 py-2.5 px-4 rounded-xl ${
              isDarkMode 
                ? selectedTdp !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                : selectedTdp !== 'all' ? 'bg-[#FFE600]/5' : 'bg-gray-50'
            }`}
            onPress={() => setShowFilterModal('tdp')}
          >
            <Text className={`text-center ${
              selectedTdp !== 'all'
                ? 'text-[#FFE600] font-medium'
                : isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              功耗 {selectedTdp !== 'all' && '•'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* CPU列表 */}
      <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
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
        animationType="slide"
        onRequestClose={() => setShowFilterModal(null)}
      >
        <View className="flex-1 justify-end">
          <TouchableOpacity 
            className="flex-1 bg-black/50"
            onPress={() => setShowFilterModal(null)}
          />
          <View className={`p-4 rounded-t-3xl ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
            <View className="flex-row justify-between items-center mb-6">
              <Text className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {showFilterModal === 'type' ? '处理器类型' : 
                 showFilterModal === 'socket' ? '处理器插槽' : '功耗范围'}
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(null)}>
                <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
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
                      isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
                    } ${selectedType === item.value && 'bg-[#FFE600]/10'}`}
                    onPress={() => {
                      setSelectedType(item.value);
                      setShowFilterModal(null);
                    }}
                  >
                    <Text className={`text-base ${
                      selectedType === item.value
                        ? 'text-[#FFE600]'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </Text>
                    {selectedType === item.value && (
                      <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                    )}
                  </TouchableOpacity>
                ))
              ) : showFilterModal === 'socket' ? (
                [
                  { label: '全部', value: 'all' },
                  ...availableSockets.map(socket => ({
                    label: socket.toUpperCase(),
                    value: socket
                  }))
                ].map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    className={`flex-row items-center justify-between p-4 rounded-xl ${
                      isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
                    } ${selectedSocket === item.value && 'bg-[#FFE600]/10'}`}
                    onPress={() => {
                      setSelectedSocket(item.value);
                      setShowFilterModal(null);
                    }}
                  >
                    <Text className={`text-base ${
                      selectedSocket === item.value
                        ? 'text-[#FFE600]'
                        : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {item.label}
                    </Text>
                    {selectedSocket === item.value && (
                      <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                    )}
                  </TouchableOpacity>
                ))
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
