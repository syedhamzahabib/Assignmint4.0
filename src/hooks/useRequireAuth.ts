import { Alert } from 'react-native';
import { useAuth } from '../state/AuthProvider';

export function useRequireAuth(navigation: any) {
  const { mode } = useAuth();
  
  return (featureName = 'this feature') => {
    if (mode === 'guest') {
      Alert.alert('Sign in required', `Create an account or log in to use ${featureName}.`, [
        { text: 'Maybe later', style: 'cancel' },
        { text: 'Sign in', onPress: () => navigation.navigate('Login') },
      ]);
      return false;
    }
    return true;
  };
}
