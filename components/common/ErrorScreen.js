// components/common/ErrorScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import TaskDetailsHeader from '../taskDetails/TaskDetailsHeader';

const ErrorScreen = ({ 
  icon = "❌", 
  title = "Error", 
  message = "Something went wrong", 
  buttonText = "Try Again", 
  onButtonPress,
  secondaryButtonText,
  onSecondaryButtonPress,
  showHeader = true,
  onBack
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {showHeader && (
        <TaskDetailsHeader 
          onBack={onBack || (() => {})}
          title="Error"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        
        <View style={styles.buttonContainer}>
          {onButtonPress && (
            <TouchableOpacity style={styles.button} onPress={onButtonPress}>
              <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
          )}
          
          {onSecondaryButtonPress && secondaryButtonText && (
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={onSecondaryButtonPress}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  button: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  secondaryButtonText: {
    color: '#2e7d32',
  },
});

export default ErrorScreen;