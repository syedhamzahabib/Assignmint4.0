// useDataSource.ts - React hook for accessing the current data source
import { useState, useEffect, useCallback } from 'react';
import DataSourceManager from '../services/DataSourceManager';
import { DataSource } from '../services/DataSource';

export const useDataSource = () => {
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('testing');

  useEffect(() => {
    const initializeDataSource = async () => {
      try {
        setIsLoading(true);
        const manager = DataSourceManager.getInstance();
        const currentDataSource = manager.getDataSource();
        const mockStatus = manager.isUsingMock();
        
        setDataSource(currentDataSource);
        setIsUsingMock(mockStatus);
        
        // Test connection
        setConnectionStatus('testing');
        const isConnected = await manager.testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        
        console.log(`useDataSource: Initialized with ${mockStatus ? 'Mock' : 'Firestore'} data source`);
      } catch (error) {
        console.error('useDataSource: Failed to initialize data source:', error);
        setConnectionStatus('disconnected');
      } finally {
        setIsLoading(false);
      }
    };

    initializeDataSource();
  }, []);

  const switchToMock = useCallback(async () => {
    try {
      setIsLoading(true);
      const manager = DataSourceManager.getInstance();
      manager.switchToMock();
      
      const newDataSource = manager.getDataSource();
      setDataSource(newDataSource);
      setIsUsingMock(true);
      setConnectionStatus('connected');
      
      console.log('useDataSource: Switched to Mock data source');
    } catch (error) {
      console.error('useDataSource: Failed to switch to Mock:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const switchToFirestore = useCallback(async () => {
    try {
      setIsLoading(true);
      const manager = DataSourceManager.getInstance();
      manager.switchToFirestore();
      
      const newDataSource = manager.getDataSource();
      setDataSource(newDataSource);
      setIsUsingMock(false);
      
      // Test Firestore connection
      setConnectionStatus('testing');
      const isConnected = await manager.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      
      console.log('useDataSource: Switched to Firestore data source');
    } catch (error) {
      console.error('useDataSource: Failed to switch to Firestore:', error);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus('testing');
      const manager = DataSourceManager.getInstance();
      const isConnected = await manager.testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
      return isConnected;
    } catch (error) {
      console.error('useDataSource: Connection test failed:', error);
      setConnectionStatus('disconnected');
      return false;
    }
  }, []);

  return {
    dataSource,
    isUsingMock,
    isLoading,
    connectionStatus,
    switchToMock,
    switchToFirestore,
    testConnection,
  };
};
