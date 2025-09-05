import { OpsDashboard, SystemHealth, ServiceHealth, DatabaseHealth, PerformanceMetrics, Alert } from '../../src/ops/opsDashboard';

describe('OpsDashboard', () => {
  let opsDashboard: OpsDashboard;
  let mockEmailService: any;
  let mockSearchService: any;
  let mockMigrationService: any;
  let mockWebhookService: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockEmailService = {
      verifyConnection: jest.fn(),
    };
    
    mockSearchService = {
      setupIndexes: jest.fn(),
    };
    
    mockMigrationService = {
      getMigrationHistory: jest.fn(),
      getPendingMigrations: jest.fn(),
    };
    
    mockWebhookService = {
      getWebhookHistory: jest.fn(),
    };
    
    opsDashboard = new OpsDashboard();
    
    // Mock the service dependencies
    (opsDashboard as any).emailService = mockEmailService;
    (opsDashboard as any).searchService = mockSearchService;
    (opsDashboard as any).migrationService = mockMigrationService;
    (opsDashboard as any).webhookService = mockWebhookService;
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      expect(opsDashboard['monitoringActive']).toBe(false);
      expect(opsDashboard['healthCheckInterval']).toBe(300000); // 5 minutes
      expect(opsDashboard['alerts']).toEqual([]);
      expect(opsDashboard['metrics']).toEqual([]);
    });

    it('should set default health thresholds', () => {
      expect(opsDashboard['healthThresholds']).toEqual({
        responseTime: 1000,
        errorRate: 0.05,
        memoryUsage: 0.8,
        cpuUsage: 0.7,
      });
    });
  });

  describe('startMonitoring', () => {
    it('should start monitoring with specified interval', () => {
      const interval = 60000; // 1 minute
      
      opsDashboard.startMonitoring(interval);
      
      expect(opsDashboard['monitoringActive']).toBe(true);
      expect(opsDashboard['healthCheckInterval']).toBe(interval);
    });

    it('should use default interval if none specified', () => {
      opsDashboard.startMonitoring();
      
      expect(opsDashboard['monitoringActive']).toBe(true);
      expect(opsDashboard['healthCheckInterval']).toBe(300000);
    });

    it('should not start monitoring if already active', () => {
      opsDashboard['monitoringActive'] = true;
      
      opsDashboard.startMonitoring();
      
      expect(opsDashboard['monitoringActive']).toBe(true);
    });
  });

  describe('stopMonitoring', () => {
    it('should stop monitoring', () => {
      opsDashboard['monitoringActive'] = true;
      
      opsDashboard.stopMonitoring();
      
      expect(opsDashboard['monitoringActive']).toBe(false);
    });

    it('should clear monitoring interval', () => {
      opsDashboard['monitoringActive'] = true;
      opsDashboard['monitoringInterval'] = setInterval(() => {}, 1000) as any;
      
      opsDashboard.stopMonitoring();
      
      expect(opsDashboard['monitoringInterval']).toBeUndefined();
    });
  });

  describe('performHealthCheck', () => {
    it('should perform comprehensive health check', async () => {
      const health = await opsDashboard.performHealthCheck();
      
      expect(health).toBeDefined();
      expect(health.timestamp).toBeInstanceOf(Date);
      expect(health.overallStatus).toBeDefined();
      expect(health.services).toBeDefined();
      expect(health.database).toBeDefined();
      expect(health.performance).toBeDefined();
    });

    it('should check all service health', async () => {
      mockEmailService.verifyConnection.mockResolvedValue({ success: true });
      mockSearchService.setupIndexes.mockResolvedValue({ success: true });
      mockMigrationService.getMigrationHistory.mockResolvedValue([]);
      mockWebhookService.getWebhookHistory.mockResolvedValue([]);
      
      const health = await opsDashboard.performHealthCheck();
      
      expect(health.services.email.status).toBe('healthy');
      expect(health.services.search.status).toBe('healthy');
      expect(health.services.migrations.status).toBe('healthy');
      expect(health.services.webhooks.status).toBe('healthy');
    });

    it('should detect service failures', async () => {
      mockEmailService.verifyConnection.mockResolvedValue({ success: false, error: 'Connection failed' });
      
      const health = await opsDashboard.performHealthCheck();
      
      expect(health.services.email.status).toBe('unhealthy');
      expect(health.services.email.error).toContain('Connection failed');
    });
  });

  describe('checkServicesHealth', () => {
    it('should check email service health', async () => {
      mockEmailService.verifyConnection.mockResolvedValue({ success: true });
      
      const servicesHealth = await opsDashboard.checkServicesHealth();
      
      expect(servicesHealth.email.status).toBe('healthy');
      expect(servicesHealth.email.responseTime).toBeDefined();
    });

    it('should check search service health', async () => {
      mockSearchService.setupIndexes.mockResolvedValue({ success: true });
      
      const servicesHealth = await opsDashboard.checkServicesHealth();
      
      expect(servicesHealth.search.status).toBe('healthy');
      expect(servicesHealth.search.responseTime).toBeDefined();
    });

    it('should check migration service health', async () => {
      mockMigrationService.getMigrationHistory.mockResolvedValue([]);
      
      const servicesHealth = await opsDashboard.checkServicesHealth();
      
      expect(servicesHealth.migrations.status).toBe('healthy');
      expect(servicesHealth.migrations.responseTime).toBeDefined();
    });

    it('should check webhook service health', async () => {
      mockWebhookService.getWebhookHistory.mockResolvedValue([]);
      
      const servicesHealth = await opsDashboard.checkServicesHealth();
      
      expect(servicesHealth.webhooks.status).toBe('healthy');
      expect(servicesHealth.webhooks.responseTime).toBeDefined();
    });

    it('should handle service timeouts', async () => {
      mockEmailService.verifyConnection.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: false, error: 'Timeout' }), 2000))
      );
      
      const servicesHealth = await opsDashboard.checkServicesHealth();
      
      expect(servicesHealth.email.status).toBe('unhealthy');
      expect(servicesHealth.email.error).toContain('Timeout');
    });
  });

  describe('checkDatabaseHealth', () => {
    it('should check database connectivity and collections', async () => {
      const dbHealth = await opsDashboard.checkDatabaseHealth();
      
      expect(dbHealth.status).toBeDefined();
      expect(dbHealth.collections).toBeDefined();
      expect(dbHealth.totalDocuments).toBeDefined();
      expect(dbHealth.lastBackup).toBeDefined();
    });

    it('should detect database issues', async () => {
      // Mock database failure
      const mockFirestore = {
        collection: jest.fn().mockImplementation(() => {
          throw new Error('Database connection failed');
        }),
      };
      
      (opsDashboard as any).db = mockFirestore;
      
      const dbHealth = await opsDashboard.checkDatabaseHealth();
      
      expect(dbHealth.status).toBe('unhealthy');
      expect(dbHealth.error).toContain('Database connection failed');
    });
  });

  describe('checkPerformanceMetrics', () => {
    it('should collect system performance metrics', async () => {
      const metrics = await opsDashboard.checkPerformanceMetrics();
      
      expect(metrics.timestamp).toBeInstanceOf(Date);
      expect(metrics.memoryUsage).toBeDefined();
      expect(metrics.cpuUsage).toBeDefined();
      expect(metrics.responseTime).toBeDefined();
      expect(metrics.errorRate).toBeDefined();
    });

    it('should calculate error rate from recent requests', () => {
      // Mock recent requests
      const mockRequests = [
        { success: true, timestamp: Date.now() - 1000 },
        { success: false, timestamp: Date.now() - 2000 },
        { success: true, timestamp: Date.now() - 3000 },
      ];
      
      (opsDashboard as any).recentRequests = mockRequests;
      
      const metrics = opsDashboard.checkPerformanceMetrics();
      
      expect(metrics.errorRate).toBe(1/3);
    });

    it('should track response time trends', () => {
      const mockRequests = [
        { responseTime: 100, timestamp: Date.now() - 1000 },
        { responseTime: 200, timestamp: Date.now() - 2000 },
        { responseTime: 150, timestamp: Date.now() - 3000 },
      ];
      
      (opsDashboard as any).recentRequests = mockRequests;
      
      const metrics = opsDashboard.checkPerformanceMetrics();
      
      expect(metrics.responseTime).toBe(150);
    });
  });

  describe('determineOverallStatus', () => {
    it('should return healthy when all services are healthy', () => {
      const servicesHealth: ServiceHealth = {
        email: { status: 'healthy', responseTime: 100, error: null },
        search: { status: 'healthy', responseTime: 150, error: null },
        migrations: { status: 'healthy', responseTime: 200, error: null },
        webhooks: { status: 'healthy', responseTime: 120, error: null },
      };
      
      const status = opsDashboard.determineOverallStatus(servicesHealth);
      
      expect(status).toBe('healthy');
    });

    it('should return degraded when some services are unhealthy', () => {
      const servicesHealth: ServiceHealth = {
        email: { status: 'healthy', responseTime: 100, error: null },
        search: { status: 'unhealthy', responseTime: 5000, error: 'Service down' },
        migrations: { status: 'healthy', responseTime: 200, error: null },
        webhooks: { status: 'healthy', responseTime: 120, error: null },
      };
      
      const status = opsDashboard.determineOverallStatus(servicesHealth);
      
      expect(status).toBe('degraded');
    });

    it('should return unhealthy when critical services are down', () => {
      const servicesHealth: ServiceHealth = {
        email: { status: 'unhealthy', responseTime: 10000, error: 'Critical failure' },
        search: { status: 'unhealthy', responseTime: 8000, error: 'Service down' },
        migrations: { status: 'healthy', responseTime: 200, error: null },
        webhooks: { status: 'unhealthy', responseTime: 5000, error: 'Connection failed' },
      };
      
      const status = opsDashboard.determineOverallStatus(servicesHealth);
      
      expect(status).toBe('unhealthy');
    });
  });

  describe('checkAlerts', () => {
    it('should create alerts for unhealthy services', async () => {
      mockEmailService.verifyConnection.mockResolvedValue({ success: false, error: 'Connection failed' });
      
      await opsDashboard.checkAlerts();
      
      expect(opsDashboard['alerts']).toHaveLength(1);
      expect(opsDashboard['alerts'][0].type).toBe('service_unhealthy');
      expect(opsDashboard['alerts'][0].message).toContain('Email service');
    });

    it('should create alerts for performance issues', async () => {
      // Mock high response time
      (opsDashboard as any).recentRequests = [
        { responseTime: 5000, timestamp: Date.now() - 1000 },
      ];
      
      await opsDashboard.checkAlerts();
      
      expect(opsDashboard['alerts']).toHaveLength(1);
      expect(opsDashboard['alerts'][0].type).toBe('performance_degraded');
      expect(opsDashboard['alerts'][0].message).toContain('Response time');
    });

    it('should not create duplicate alerts', async () => {
      mockEmailService.verifyConnection.mockResolvedValue({ success: false, error: 'Connection failed' });
      
      await opsDashboard.checkAlerts();
      await opsDashboard.checkAlerts();
      
      expect(opsDashboard['alerts']).toHaveLength(1);
    });
  });

  describe('createAlert', () => {
    it('should create alert with correct properties', () => {
      const alert = opsDashboard.createAlert('test_alert', 'Test alert message', 'warning');
      
      expect(alert.id).toBeDefined();
      expect(alert.type).toBe('test_alert');
      expect(alert.message).toBe('Test alert message');
      expect(alert.severity).toBe('warning');
      expect(alert.timestamp).toBeInstanceOf(Date);
      expect(alert.acknowledged).toBe(false);
    });

    it('should add alert to alerts list', () => {
      const initialCount = opsDashboard['alerts'].length;
      
      opsDashboard.createAlert('test', 'Test message', 'info');
      
      expect(opsDashboard['alerts']).toHaveLength(initialCount + 1);
    });

    it('should limit alerts list size', () => {
      // Fill alerts beyond limit
      for (let i = 0; i < 150; i++) {
        opsDashboard.createAlert(`alert_${i}`, `Message ${i}`, 'info');
      }
      
      expect(opsDashboard['alerts']).toHaveLength(100); // Max limit
    });
  });

  describe('sendAlertNotification', () => {
    it('should send notification for critical alerts', async () => {
      const alert = opsDashboard.createAlert('critical_test', 'Critical message', 'critical');
      
      const result = await opsDashboard.sendAlertNotification(alert);
      
      expect(result.success).toBe(true);
    });

    it('should not send notification for non-critical alerts', async () => {
      const alert = opsDashboard.createAlert('info_test', 'Info message', 'info');
      
      const result = await opsDashboard.sendAlertNotification(alert);
      
      expect(result.success).toBe(true);
      expect(result.sent).toBe(false);
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge alert by ID', () => {
      const alert = opsDashboard.createAlert('test', 'Test message', 'warning');
      
      const result = opsDashboard.acknowledgeAlert(alert.id);
      
      expect(result.success).toBe(true);
      expect(alert.acknowledged).toBe(true);
      expect(alert.acknowledgedAt).toBeInstanceOf(Date);
    });

    it('should return error for non-existent alert', () => {
      const result = opsDashboard.acknowledgeAlert('non_existent_id');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Alert not found');
    });
  });

  describe('getDashboardData', () => {
    it('should return comprehensive dashboard data', async () => {
      const dashboardData = await opsDashboard.getDashboardData();
      
      expect(dashboardData.health).toBeDefined();
      expect(dashboardData.alerts).toBeDefined();
      expect(dashboardData.metrics).toBeDefined();
      expect(dashboardData.services).toBeDefined();
      expect(dashboardData.database).toBeDefined();
    });

    it('should include recent alerts', async () => {
      opsDashboard.createAlert('test1', 'Test alert 1', 'warning');
      opsDashboard.createAlert('test2', 'Test alert 2', 'info');
      
      const dashboardData = await opsDashboard.getDashboardData();
      
      expect(dashboardData.alerts).toHaveLength(2);
      expect(dashboardData.alerts[0].type).toBe('test1');
      expect(dashboardData.alerts[1].type).toBe('test2');
    });

    it('should include performance metrics', async () => {
      const dashboardData = await opsDashboard.getDashboardData();
      
      expect(dashboardData.metrics).toBeDefined();
      expect(dashboardData.metrics.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('updateConfig', () => {
    it('should update health check interval', () => {
      const newInterval = 120000; // 2 minutes
      
      const result = opsDashboard.updateConfig({ healthCheckInterval: newInterval });
      
      expect(result.success).toBe(true);
      expect(opsDashboard['healthCheckInterval']).toBe(newInterval);
    });

    it('should update health thresholds', () => {
      const newThresholds = {
        responseTime: 2000,
        errorRate: 0.1,
        memoryUsage: 0.9,
        cpuUsage: 0.8,
      };
      
      const result = opsDashboard.updateConfig({ healthThresholds: newThresholds });
      
      expect(result.success).toBe(true);
      expect(opsDashboard['healthThresholds']).toEqual(newThresholds);
    });

    it('should validate configuration values', () => {
      const invalidConfig = {
        healthCheckInterval: -1000, // Invalid negative value
      };
      
      const result = opsDashboard.updateConfig(invalidConfig);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid configuration');
    });
  });

  describe('getSystemMetrics', () => {
    it('should return system metrics summary', () => {
      const metrics = opsDashboard.getSystemMetrics();
      
      expect(metrics.totalAlerts).toBeDefined();
      expect(metrics.activeAlerts).toBeDefined();
      expect(metrics.systemUptime).toBeDefined();
      expect(metrics.lastHealthCheck).toBeDefined();
    });

    it('should calculate active alerts correctly', () => {
      opsDashboard.createAlert('acknowledged', 'Acknowledged alert', 'warning');
      opsDashboard.createAlert('active', 'Active alert', 'error');
      
      // Acknowledge one alert
      const alerts = opsDashboard['alerts'];
      const firstAlert = alerts[0];
      if (firstAlert) {
        opsDashboard.acknowledgeAlert(firstAlert.id);
      }
      
      const systemMetrics = opsDashboard.getSystemMetrics();
      
      expect(systemMetrics.totalAlerts).toBe(2);
      expect(systemMetrics.activeAlerts).toBe(1);
    });
  });

  describe('exportHealthReport', () => {
    it('should export comprehensive health report', async () => {
      const report = await opsDashboard.exportHealthReport();
      
      expect(report.timestamp).toBeInstanceOf(Date);
      expect(report.health).toBeDefined();
      expect(report.alerts).toBeDefined();
      expect(report.metrics).toBeDefined();
      expect(report.services).toBeDefined();
      expect(report.database).toBeDefined();
    });

    it('should include report metadata', async () => {
      const report = await opsDashboard.exportHealthReport();
      
      expect(report.version).toBeDefined();
      expect(report.generatedBy).toBeDefined();
      expect(report.format).toBe('json');
    });
  });

  describe('monitoring lifecycle', () => {
    it('should start and stop monitoring correctly', () => {
      expect(opsDashboard['monitoringActive']).toBe(false);
      
      opsDashboard.startMonitoring();
      expect(opsDashboard['monitoringActive']).toBe(true);
      
      opsDashboard.stopMonitoring();
      expect(opsDashboard['monitoringActive']).toBe(false);
    });

    it('should perform periodic health checks when monitoring', async () => {
      jest.useFakeTimers();
      
      opsDashboard.startMonitoring(1000); // 1 second interval
      
      // Fast-forward time
      jest.advanceTimersByTime(1000);
      
      // Wait for async operations
      await new Promise(resolve => setImmediate(resolve));
      
      expect(opsDashboard['alerts']).toBeDefined();
      
      jest.useRealTimers();
      opsDashboard.stopMonitoring();
    });
  });
});
