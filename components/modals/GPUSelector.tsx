import { View, Text, Modal, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';
import { GPU } from '../../types/gpu';

interface GPUSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (gpu: GPU) => void;
  gpuData: GPU[];
}

export const GPUSelector = ({ visible, onClose, onSelect, gpuData }: GPUSelectorProps) => {
  const { isDarkMode } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 20;

  const filteredGPUs = gpuData.filter(gpu => 
    gpu.gpu_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedGPUs = filteredGPUs.slice(0, page * pageSize);

  const handleLoadMore = () => {
    if (paginatedGPUs.length < filteredGPUs.length) {
      setLoading(true);
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
              placeholder="搜索显卡型号..."
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                setPage(1);
              }}
            />
            <FlatList
              data={paginatedGPUs}
              keyExtractor={(item) => item.gpu_name}
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
                    {item.gpu_name}
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