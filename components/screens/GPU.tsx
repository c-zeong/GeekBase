import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect } from 'react';
import { GPU as GPUType } from '../../types/gpu';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system';
import Papa from 'papaparse';
import { Asset } from 'expo-asset';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
// 修改导入路径，因为当前文件在 components/screens 目录下
import { GPUDetail } from '../features/gpu/GPUDetail';

export const GPU = () => {
  const { isDarkMode } = useTheme();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedSeries, setSelectedSeries] = useState('all');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  const [showFilterModal, setShowFilterModal] = useState<string | null>(null);
  const [selectedGpu, setSelectedGpu] = useState<GPUType | null>(null);
  const [gpuData, setGpuData] = useState<GPUType[]>([]);
  const [filteredData, setFilteredData] = useState<GPUType[]>([]);
  const [page, setPage] = useState(1);
  const [memoryFilter, setMemoryFilter] = useState('all');
  const [tdpFilter, setTdpFilter] = useState('all');
  const itemsPerPage = 10;

  // 加载数据的 useEffect
  useEffect(() => {
    const loadGPUData = async () => {
      try {
        const csvFile = require('../../assets/gpu.csv');
        const asset = await Asset.fromModule(csvFile).downloadAsync();
        
        if (!asset.localUri) {
          throw new Error('Failed to load CSV file');
        }
        
        const csvText = await FileSystem.readAsStringAsync(asset.localUri);
        
        Papa.parse<GPUType>(csvText, {
          header: true,
          complete: (results) => {
            if (results.data && results.errors.length === 0) {
              setGpuData(results.data);
            } else if (results.errors.length > 0) {
              console.error('CSV parsing errors:', results.errors);
            }
          }
        });
      } catch (error) {
        console.error('Error loading GPU data:', error);
      }
    };

    loadGPUData();
  }, []);

  // 筛选逻辑的 useEffect
  useEffect(() => {
    let filtered = gpuData;

    // 搜索过滤
    if (searchText) {
      filtered = filtered.filter(gpu => 
        gpu.gpu_name.toLowerCase().includes(searchText.toLowerCase()) ||
        gpu.architecture.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 类型筛选
    if (selectedSeries !== 'all') {
      filtered = filtered.filter(gpu => {
        switch (selectedSeries) {
          case 'desktop':
            return gpu.type === 'Desktop';
          case 'mobile':
            return gpu.type === 'Laptop';
          case 'professional':
            return gpu.type === 'Professional';
          case 'integrated':
            return gpu.type === 'Integrated';
          default:
            return true;
        }
      });
    }

    // 制造商筛选
    if (selectedManufacturer !== 'all') {
      filtered = filtered.filter(gpu => gpu.brand === selectedManufacturer);
    }

    // TDP 筛选
    if (tdpFilter !== 'all') {
      filtered = filtered.filter(gpu => {
        const tdp = parseInt(gpu.tdp);
        switch (tdpFilter) {
          case 'under100':
            return tdp < 100;
          case '100to200':
            return tdp >= 100 && tdp < 200;
          case '200to300':
            return tdp >= 200 && tdp < 300;
          case '300to400':
            return tdp >= 300 && tdp < 400;
          case 'above400':
            return tdp >= 400;
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);
    setPage(1);
  }, [searchText, selectedSeries, tdpFilter, selectedManufacturer, gpuData]);

  // 添加分页数据计算
  const paginatedData = filteredData.slice(0, page * itemsPerPage);
  const hasMore = paginatedData.length < filteredData.length;

  return (
    <View className="flex-1">
          <SafeAreaView className={isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}>
            <View className="px-4 py-2 flex-row items-center space-x-3">
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={24} color={isDarkMode ? '#fff' : '#000'} />
              </TouchableOpacity>
              
              <View className={`flex-1 flex-row items-center px-3 py-1.5 rounded-full ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-gray-100'}`}>
                <Ionicons name="search-outline" size={18} color={isDarkMode ? '#666' : '#999'} />
                <TextInput
                  className={`flex-1 ml-2 text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}
                  placeholder="搜索显卡"
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
                        ? tdpFilter !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                        : tdpFilter !== 'all' ? 'bg-[#FFE600]/5' : 'bg-gray-50'
                    }`}
                    onPress={() => setShowFilterModal('tdp')}
                  >
                    <Text className={`text-center ${
                      tdpFilter !== 'all'
                        ? 'text-[#FFE600] font-medium'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      功耗 {tdpFilter !== 'all' && '•'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className={`flex-1 py-2.5 px-4 rounded-xl ${
                      isDarkMode 
                        ? selectedSeries !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                        : selectedSeries !== 'all' ? 'bg-[#FFE600]/5' : 'bg-gray-50'
                    }`}
                    onPress={() => setShowFilterModal('series')}
                  >
                    <Text className={`text-center ${
                      selectedSeries !== 'all'
                        ? 'text-[#FFE600] font-medium'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      分类 {selectedSeries !== 'all' && '•'}
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className={`flex-1 py-2.5 px-4 rounded-xl ${
                      isDarkMode 
                        ? selectedManufacturer !== 'all' ? 'bg-[#FFE600]/10' : 'bg-[#2A2A2A]'
                        : selectedManufacturer !== 'all' ? 'bg-[#FFE600]/5' : 'bg-gray-50'
                    }`}
                    onPress={() => setShowFilterModal('manufacturer')}
                  >
                    <Text className={`text-center ${
                      selectedManufacturer !== 'all'
                        ? 'text-[#FFE600] font-medium'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      制造商 {selectedManufacturer !== 'all' && '•'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>

              {/* 显卡列表 */}
              <ScrollView className={`flex-1 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-50'}`}>
                <View className="p-4">
                  {paginatedData.map((gpu: GPUType) => (
                    <TouchableOpacity 
                      key={gpu._id} 
                      className={`mb-3 p-4 rounded-2xl ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}
                      onPress={() => setSelectedGpu(gpu)}
                    >
                      <View className="flex-row justify-between items-start mb-2">
                        <Text className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {gpu.gpu_name}
                        </Text>
                        {gpu.score && (
                          <View className={`px-3 py-1 rounded-full ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-gray-100'}`}>
                            <Text className="text-[#FFE600] font-medium">{gpu.score}</Text>
                          </View>
                        )}
                      </View>
                      
                      <View className="flex-row items-center mb-1">
                        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {gpu.architecture}
                        </Text>
                        <View className="h-1 w-1 rounded-full bg-gray-400 mx-2" />
                        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {gpu.memory_size}
                        </Text>
                        <View className="h-1 w-1 rounded-full bg-gray-400 mx-2" />
                        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {gpu.tdp}W
                        </Text>
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
                transparent
                animationType="fade"
                onRequestClose={() => setShowFilterModal(null)}
              >
                <TouchableOpacity 
                  className="flex-1 bg-black/50"
                  activeOpacity={1}
                  onPress={() => setShowFilterModal(null)}
                >
                  <View className={`absolute bottom-0 w-full rounded-t-3xl ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
                    <View className="p-6">
                      <View className="flex-row justify-between items-center mb-6">
                        <Text className={`text-xl font-medium ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {showFilterModal === 'tdp' ? '功耗' : 
                           showFilterModal === 'series' ? '显卡类型' : '制造商'}
                        </Text>
                        <TouchableOpacity onPress={() => setShowFilterModal(null)}>
                          <Ionicons name="close" size={24} color={isDarkMode ? '#fff' : '#000'} />
                        </TouchableOpacity>
                      </View>

                      <View className="space-y-4">
                        {showFilterModal === 'series' ? (
                          [
                            { label: '全部', value: 'all' },
                            { label: '桌面端', value: 'desktop' },
                            { label: '移动端', value: 'mobile' },
                            { label: '专业显卡', value: 'professional' },
                            { label: '集成显卡', value: 'integrated' }
                          ].map((item) => (
                            <TouchableOpacity
                              key={item.value}
                              className={`flex-row items-center justify-between p-4 rounded-xl ${
                                isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
                              } ${selectedSeries === item.value && 'bg-[#FFE600]/10'}`}
                              onPress={() => setSelectedSeries(item.value)}
                            >
                              <Text className={`text-base ${
                                selectedSeries === item.value
                                  ? 'text-[#FFE600]'
                                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item.label}
                              </Text>
                              {selectedSeries === item.value && (
                                <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                              )}
                            </TouchableOpacity>
                          ))
                        ) : showFilterModal === 'tdp' ? (
                          [
                            { label: '全部', value: 'all' },
                            { label: '100W 以下', value: 'under100' },
                            { label: '100W - 200W', value: '100to200' },
                            { label: '200W - 300W', value: '200to300' },
                            { label: '300W - 400W', value: '300to400' },
                            { label: '400W 以上', value: 'above400' }
                          ].map((item) => (
                            <TouchableOpacity
                              key={item.value}
                              className={`flex-row items-center justify-between p-4 rounded-xl ${
                                isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
                              } ${tdpFilter === item.value && 'bg-[#FFE600]/10'}`}
                              onPress={() => setTdpFilter(item.value)}
                            >
                              <Text className={`text-base ${
                                tdpFilter === item.value
                                  ? 'text-[#FFE600]'
                                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item.label}
                              </Text>
                              {tdpFilter === item.value && (
                                <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                              )}
                            </TouchableOpacity>
                          ))
                        ) : (
                          [
                            { label: '全部', value: 'all' },
                            { label: 'NVIDIA', value: 'NVIDIA' },
                            { label: 'AMD', value: 'AMD' },
                            { label: 'Intel', value: 'Intel' }
                          ].map((item) => (
                            <TouchableOpacity
                              key={item.value}
                              className={`flex-row items-center justify-between p-4 rounded-xl ${
                                isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'
                              } ${selectedManufacturer === item.value && 'bg-[#FFE600]/10'}`}
                              onPress={() => setSelectedManufacturer(item.value)}
                            >
                              <Text className={`text-base ${
                                selectedManufacturer === item.value
                                  ? 'text-[#FFE600]'
                                  : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                {item.label}
                              </Text>
                              {selectedManufacturer === item.value && (
                                <View className="h-2 w-2 rounded-full bg-[#FFE600]" />
                              )}
                            </TouchableOpacity>
                          ))
                        )}

                        <TouchableOpacity 
                          className="mt-6 py-4 bg-[#FFE600] rounded-xl"
                          onPress={() => setShowFilterModal(null)}
                        >
                          <Text className="text-center font-medium text-black">确定</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Modal>

              <GPUDetail 
                gpu={selectedGpu}
                visible={!!selectedGpu}
                onClose={() => setSelectedGpu(null)}
              />
            </View>
          );
};