import { View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { CPUCompare } from '../templates/CPUCompare';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Asset } from 'expo-asset';
import Papa from 'papaparse';
import { CPU } from '../../types/cpu';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GPUCompare } from '../templates/GPUCompare';
import { GPU } from '../../types/gpu';

const Stack = createNativeStackNavigator();
const CompareStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompareHome" component={CompareScreen} />
    </Stack.Navigator>
  );
};

const CompareScreen = () => {
  const { isDarkMode } = useTheme();
  const [compareType, setCompareType] = useState('cpu');
  const [cpuData, setCpuData] = useState<CPU[]>([]);
  const [gpuData, setGpuData] = useState<GPU[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载 CPU 数据
        const cpuCsvModule = require('../../assets/cpu.csv');
        const [{ localUri: cpuUri }] = await Asset.loadAsync(cpuCsvModule);
        
        if (cpuUri) {
          const cpuResponse = await fetch(cpuUri);
          const cpuCsvText = await cpuResponse.text();
          
          Papa.parse<CPU>(cpuCsvText, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim(),
            complete: (results) => {
              if (results.data) {
                setCpuData(results.data);
              }
            }
          });
        }

        // 加载 GPU 数据
        const gpuCsvModule = require('../../assets/gpu.csv');
        const [{ localUri: gpuUri }] = await Asset.loadAsync(gpuCsvModule);
        
        if (gpuUri) {
          const gpuResponse = await fetch(gpuUri);
          const gpuCsvText = await gpuResponse.text();
          
          Papa.parse<GPU>(gpuCsvText, {
            header: true,
            skipEmptyLines: true,
            transform: (value) => value.trim(),
            complete: (results) => {
              if (results.data) {
                setGpuData(results.data);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  return (
    <View className="flex-1">
      {/* 顶部标题栏 */}
      <SafeAreaView className={isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
            对比
          </Text>
          <View className="flex-row space-x-4">
            <TouchableOpacity 
              className={`px-4 py-2 rounded-full ${compareType === 'cpu' ? (isDarkMode ? 'bg-[#333]' : 'bg-gray-100') : (isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white')}`}
              onPress={() => setCompareType('cpu')}
            >
              <Text className={compareType === 'cpu' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                CPU
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`px-4 py-2 rounded-full ${compareType === 'gpu' ? (isDarkMode ? 'bg-[#333]' : 'bg-gray-100') : (isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white')}`}
              onPress={() => setCompareType('gpu')}
            >
              <Text className={compareType === 'gpu' ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                显卡
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      
      {compareType === 'cpu' ? (
        <CPUCompare cpuData={cpuData} />
      ) : (
        <GPUCompare gpuData={gpuData} />
      )}
    </View>
  );
};

export const Compare = CompareStack;