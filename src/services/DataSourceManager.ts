// DataSourceManager.ts - Manages switching between mock and Firestore data sources
import { DataSource } from './DataSource';
import { MockDataSource } from './MockDataSource';
import { FirestoreDataSource } from './FirestoreDataSource';

class DataSourceManager {
  private static instance: DataSourceManager;
  private dataSource: DataSource;
  private useMock: boolean;

  private constructor() {
    // Check environment configuration or default to Firestore
    this.useMock = false; // Will be updated in initialize()
    this.dataSource = new FirestoreDataSource(); // Default to Firestore
    
    this.initialize();
  }

  private async initialize() {
    try {
      // Import environment config dynamically to avoid circular dependencies
      const { isMockDataEnabled } = await import('../config/environment');
      this.useMock = isMockDataEnabled();
      this.dataSource = this.useMock ? new MockDataSource() : new FirestoreDataSource();
      
      console.log(`DataSourceManager: Using ${this.useMock ? 'Mock' : 'Firestore'} data source`);
    } catch (error) {
      console.warn('DataSourceManager: Failed to load environment config, using Firestore as default:', error);
      this.useMock = false;
      this.dataSource = new FirestoreDataSource();
    }
  }

  public static getInstance(): DataSourceManager {
    if (!DataSourceManager.instance) {
      DataSourceManager.instance = new DataSourceManager();
    }
    return DataSourceManager.instance;
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public isUsingMock(): boolean {
    return this.useMock;
  }

  public switchToMock(): void {
    this.useMock = true;
    this.dataSource = new MockDataSource();
    console.log('DataSourceManager: Switched to Mock data source');
  }

  public switchToFirestore(): void {
    this.useMock = false;
    this.dataSource = new FirestoreDataSource();
    console.log('DataSourceManager: Switched to Firestore data source');
  }

  public async testConnection(): Promise<boolean> {
    try {
      if (this.useMock) {
        // Mock data source is always available
        return true;
      } else {
        // Test Firestore connection
        const tasks = await this.dataSource.getTasks();
        return Array.isArray(tasks);
      }
    } catch (error) {
      console.error('DataSourceManager: Connection test failed:', error);
      return false;
    }
  }
}

export default DataSourceManager;
