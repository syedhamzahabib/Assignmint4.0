import { describe, it, expect, beforeAll } from 'vitest';
import DataSourceManager from '../src/data/DataSourceManager';
import { MockDataSource } from '../src/data/MockDataSource';

describe('Backend Basic Setup', () => {
  let dataSourceManager: DataSourceManager;

  beforeAll(() => {
    dataSourceManager = DataSourceManager.getInstance();
  });

  it('should initialize with mock data source when MOCK_DATA=true', () => {
    const dataSource = dataSourceManager.getDataSource();
    expect(dataSource).toBeInstanceOf(MockDataSource);
  });

  it('should connect to mock data source successfully', async () => {
    const isConnected = await dataSourceManager.testConnection();
    expect(isConnected).toBe(true);
  });

  it('should return current data source type', () => {
    const dataSourceType = dataSourceManager.getCurrentDataSourceType();
    expect(dataSourceType).toBe('Mock');
  });

  it('should get tasks from mock data source', async () => {
    const dataSource = dataSourceManager.getDataSource();
    const result = await dataSource.getTasks();
    
    expect(result).toHaveProperty('tasks');
    expect(result).toHaveProperty('total');
    expect(result).toHaveProperty('page');
    expect(result).toHaveProperty('totalPages');
    expect(Array.isArray(result.tasks)).toBe(true);
    expect(result.tasks.length).toBeGreaterThan(0);
  });

  it('should filter tasks by subject', async () => {
    const dataSource = dataSourceManager.getDataSource();
    const result = await dataSource.getTasks({ subject: 'Mathematics' });
    
    expect(result.tasks.every(task => task.subject === 'Mathematics')).toBe(true);
  });

  it('should search tasks by query', async () => {
    const dataSource = dataSourceManager.getDataSource();
    const result = await dataSource.getTasks({ q: 'calculus' });
    
    expect(result.tasks.some(task => 
      task.title.toLowerCase().includes('calculus') ||
      task.description.toLowerCase().includes('calculus')
    )).toBe(true);
  });
});
