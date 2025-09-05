const { IDataSource } = require('../types/IDataSource');
const { MockDataSource } = require('./MockDataSource');
const { FirestoreDataSource } = require('./FirestoreDataSource');
const { logger } = require('../utils/logger');

class DataSourceManager {
  private static instance: DataSourceManager;
  private dataSource: any;
  private firestoreInstance: any = null;

  private constructor() {
    this.initializeDataSource();
  }

  private initializeDataSource() {
    const useMock = process.env['MOCK_DATA'] === 'true';
    
    if (useMock) {
      this.dataSource = new MockDataSource();
      logger.info('DataSourceManager: Using Mock data source');
    } else {
      // FirestoreDataSource will be initialized later when Firestore is available
      this.dataSource = new MockDataSource(); // Fallback to mock for now
      logger.info('DataSourceManager: Firestore not ready, using Mock data source as fallback');
    }
  }

  public setFirestoreInstance(db: any) {
    this.firestoreInstance = db;
    if (process.env['MOCK_DATA'] !== 'true') {
      this.dataSource = new FirestoreDataSource(db);
      logger.info('DataSourceManager: Switched to Firestore data source');
    }
  }

  public static getInstance(): DataSourceManager {
    if (!DataSourceManager.instance) {
      DataSourceManager.instance = new DataSourceManager();
    }
    return DataSourceManager.instance;
  }

  public getDataSource(): any {
    return this.dataSource;
  }

  public async switchToMock(): Promise<void> {
    this.dataSource = new MockDataSource();
    logger.info('DataSourceManager: Switched to Mock data source');
  }

  public async switchToFirestore(): Promise<void> {
    if (this.firestoreInstance) {
      this.dataSource = new FirestoreDataSource(this.firestoreInstance);
      logger.info('DataSourceManager: Switched to Firestore data source');
    } else {
      logger.error('DataSourceManager: Cannot switch to Firestore - no instance available');
    }
  }

  public async testConnection(): Promise<boolean> {
    try {
      return await this.dataSource.testConnection();
    } catch (error) {
      logger.error('DataSourceManager: Connection test failed:', error);
      return false;
    }
  }

  public getCurrentDataSourceType(): string {
    return this.dataSource instanceof MockDataSource ? 'Mock' : 'Firestore';
  }
}

module.exports = { DataSourceManager };
