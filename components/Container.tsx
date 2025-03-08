import { SafeAreaView } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className="flex-1 bg-light-bg dark:bg-dark-bg">{children}</SafeAreaView>;
};
