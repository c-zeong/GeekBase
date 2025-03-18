import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import { CPU } from '../../types/cpu';

interface CPUSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (cpu: CPU) => void;
  cpuData: CPU[];
}

export const CPUSelector = ({ visible, onClose, onSelect, cpuData }: CPUSelectorProps) => {
  const { isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 20;

  const filteredCPUs = cpuData.filter(cpu => 
    cpu.cpu_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedCPUs = filteredCPUs.slice(0, page * pageSize);

  const handleLoadMore = () => {
    if (paginatedCPUs.length < filteredCPUs.length) {
      setLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        setPage(prev => prev + 1);
        setLoading(false);
      }, 500);
    }
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color={isDarkMode ? '#FFE600' : '#666'} />
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View 
          className={`absolute bottom-0 w-full h-[70%] ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'} rounded-t-3xl`}
        >
          <View className="p-4">
            <TextInput
              className={`px-4 py-2 mb-4 rounded-xl ${
                isDarkMode ? 'bg-[#1A1A1A] text-white' : 'bg-gray-100 text-black'
              }`}
              placeholder="搜索 CPU 型号..."
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setPage(1); // 重置页码
              }}
            />
            <FlatList
              data={paginatedCPUs}
              keyExtractor={(item) => item.cpu_name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className={`py-3 px-4 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-200'
                  }`}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                    setSearchText('');
                    setPage(1);
                  }}
                >
                  <Text className={isDarkMode ? 'text-white' : 'text-black'}>
                    {item.cpu_name}
                  </Text>
                </TouchableOpacity>
              )}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};