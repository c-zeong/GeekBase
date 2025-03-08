import { View, Text } from 'react-native';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { CPUCompare } from '../templates/CPUCompare';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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

  return (
    <View className="flex-1">
      <SafeAreaView className={isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}>
        <View className="px-4 py-3">
          <Picker
            selectedValue={compareType}
            onValueChange={(value) => setCompareType(value)}
            className={isDarkMode ? 'text-white' : 'text-black'}
          >
            <Picker.Item label="CPU" value="cpu" color={isDarkMode ? '#FFFFFF' : '#000000'} />
            <Picker.Item label="显卡" value="gpu" color={isDarkMode ? '#FFFFFF' : '#000000'} />
            <Picker.Item label="硬盘" value="storage" color={isDarkMode ? '#FFFFFF' : '#000000'} />
          </Picker>
        </View>
      </SafeAreaView>
      
      {compareType === 'cpu' && <CPUCompare />}
    </View>
  );
};

export const Compare = CompareStack;