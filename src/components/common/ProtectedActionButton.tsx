import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../../constants';
import { useRequireAuth } from '../../hooks/useRequireAuth';

interface ProtectedActionButtonProps {
  title: string;
  featureName: string;
  onPress: () => void;
  style?: any;
  textStyle?: any;
  onSignIn?: () => void;
  onMaybeLater?: () => void;
}

export const ProtectedActionButton: React.FC<ProtectedActionButtonProps> = ({
  title,
  featureName,
  onPress,
  style,
  textStyle,
  onSignIn,
  onMaybeLater,
}) => {
  const requireAuth = useRequireAuth({
    featureName,
    onSignIn,
    onMaybeLater,
  });

  const handlePress = () => {
    if (requireAuth(featureName)) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={[styles.button, style]} onPress={handlePress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weights.semiBold,
  },
});
