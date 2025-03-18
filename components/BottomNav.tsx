import { View, Text, Pressable, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const tabs = [
  { 
    name: 'Home', 
    label: '首页', 
    icon: 'grid' as const,
  },
  { 
    name: 'Compare', 
    label: '对比', 
    icon: 'bar-chart' as const,
  }
] as const;

export const BottomNav = ({ state, navigation }: BottomTabBarProps) => {
  const { isDarkMode } = useTheme();
  const fadeAnims = useRef(tabs.map(() => new Animated.Value(0))).current;
  
  useEffect(() => {
    Animated.parallel(
      fadeAnims.map((anim, index) => {
        return Animated.timing(anim, {
          toValue: state.index === index ? 1 : 0,
          duration: 200,
          useNativeDriver: true,
        });
      })
    ).start();
  }, [state.index]);
  
  return (
    <View className={`flex-row rounded-t-3xl  ${
      isDarkMode ? 'bg-[#2A2A2A] border-[#333333]' : 'bg-white border-gray-200'
    }`}>
      {tabs.map((tab, index) => (
        <Pressable
          key={tab.name}
          className="flex-1 py-3 items-center relative"
          onPress={() => navigation.navigate(tab.name)}
        >
          <Animated.View 
            className="absolute w-12 h-12 rounded-full bg-[#FBBF24]/10"
            style={{
              opacity: fadeAnims[index],
              transform: [{
                scale: fadeAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }}
          />
          <Ionicons
            name={`${tab.icon}${state.index === index ? '' : '-outline'}`}
            size={24}
            color={state.index === index ? '#FBBF24' : isDarkMode ? '#fff' : '#666'}
          />
          <Text className={`text-xs mt-1 ${
            state.index === index 
              ? 'text-[#FBBF24]' 
              : isDarkMode ? 'text-white' : 'text-gray-500'
          }`}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};