import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handlePress = () => {
    toggleTheme();
    // Force update the status bar style
    requestAnimationFrame(() => {
      // Additional frame to ensure UI updates
    });
  };

  return (
    <SafeAreaView style={{ 
      backgroundColor: isDarkMode ? '#1A1A1A' : '#FFFFFF' 
    }}>
      <View style={{ 
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12
      }}>
        <Text style={{ 
          fontSize: 20,
          fontWeight: 'bold',
          color: isDarkMode ? '#FFFFFF' : '#000000'
        }}>
          主页
        </Text>
        <TouchableOpacity 
          onPress={handlePress}
          style={{
            height: 40,
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
          }}>
          <Ionicons 
            name={isDarkMode ? "moon" : "sunny"} 
            size={22} 
            color={isDarkMode ? "#FFE600" : "#FF9500"} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};