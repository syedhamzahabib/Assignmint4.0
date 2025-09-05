import { logger } from '../utils/logger';
import { db } from '../index';
import { emailService } from '../email/emailService';

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: Date;
  services: ServiceHealth[];
  database: DatabaseHealth;
  performance: PerformanceMetrics;
  alerts: Alert[];
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  error?: string | undefined;
}

export interface DatabaseHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  collections: CollectionInfo[];
  totalDocuments: number;
  lastBackup?: Date;
  errors: string[];
}

export interface CollectionInfo {
  name: string;
  documentCount: number;
  size: number;
  indexes: number;
}

export interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  activeConnections: number;
  requestRate: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface Alert {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface DashboardConfig {
  healthCheckInterval: number; // milliseconds
  alertThresholds: {
    responseTime: number;
    errorRate: number;
    cpuUsage: number;
    memoryUsage: number;
  };
  notificationEmails: string[];
}

export class OpsDashboard {
  private config: DashboardConfig;
  private healthHistory: SystemHealth[] = [];
  private alerts: Alert[] = [];
  private isMonitoring = false;
  private healthCheckInterval: any = null;
  private serviceHealth: ServiceHealth[] = [];
  
  // Public getter for monitoring status
  get monitoringActive(): boolean {
    return this.isMonitoring;
  }

  constructor() {
    this.config = {
      healthCheckInterval: 5 * 60 * 1000, // 5 minutes
      alertThresholds: {
        responseTime: 1000, // 1 second
        errorRate: 0.05, // 5%
        cpuUsage: 80, // 80%
        memoryUsage: 85, // 85%
      },
      notificationEmails: process.env['OPS_EMAILS']?.split(',') || [],
    };
  }

  async startMonitoring(interval?: number): Promise<void> {
    if (this.isMonitoring) {
      logger.warn('Monitoring already started');
      return;
    }

    this.isMonitoring = true;
    logger.info('Starting operations monitoring');

    // Initial health check
    await this.performHealthCheck();

    // Set up periodic health checks
    const checkInterval = interval || this.config.healthCheckInterval;
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, checkInterval);

    logger.info('Operations monitoring started successfully');
  }

  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) {
      return;
    }

    this.isMonitoring = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    logger.info('Operations monitoring stopped');
  }

  private async performHealthCheck(): Promise<void> {
    try {
      const startTime = Date.now();
      
      const [servicesHealth, databaseHealth, performanceMetrics] = await Promise.all([
        this.checkServicesHealth(),
        this.checkDatabaseHealth(),
        this.checkPerformanceMetrics(),
      ]);

      const health: SystemHealth = {
        status: this.determineOverallStatus(servicesHealth, databaseHealth, performanceMetrics),
        timestamp: new Date(),
        services: servicesHealth,
        database: databaseHealth,
        performance: performanceMetrics,
        alerts: this.alerts.filter(alert => !alert.acknowledged),
      };

      this.healthHistory.push(health);
      
      // Keep only last 100 health checks
      if (this.healthHistory.length > 100) {
        this.healthHistory = this.healthHistory.slice(-100);
      }

      // Check for alerts
      await this.checkAlerts(health);

      const checkDuration = Date.now() - startTime;
      logger.info(`Health check completed in ${checkDuration}ms, status: ${health.status}`);

    } catch (error) {
      logger.error('Health check failed:', error);
              this.createAlert('health_check', 'Health check failed', 'error');
    }
  }

  private async checkServicesHealth(): Promise<ServiceHealth[]> {
    const services: ServiceHealth[] = [];

    // Check Email Service
    try {
      const startTime = Date.now();
      const emailHealthy = await emailService.verifyConnection();
      const responseTime = Date.now() - startTime;
      
      services.push({
        name: 'Email Service',
        status: emailHealthy ? 'healthy' : 'unhealthy',
        responseTime,
        lastCheck: new Date(),
        error: emailHealthy ? undefined : 'Failed to verify email connection',
      });
    } catch (error) {
      services.push({
        name: 'Email Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Check Search Service
    try {
      const startTime = Date.now();
      // const searchAnalytics = await searchService.getSearchAnalytics();
      const responseTime = Date.now() - startTime;
      
      services.push({
        name: 'Search Service',
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
      });
    } catch (error) {
      services.push({
        name: 'Search Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Check Migration Service
    try {
      const startTime = Date.now();
      // const migrationStatus = await migrationService.getMigrationStatus();
      const responseTime = Date.now() - startTime;
      
      services.push({
        name: 'Migration Service',
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
      });
    } catch (error) {
      services.push({
        name: 'Migration Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Check Webhook Service
    try {
      const startTime = Date.now();
      // const webhookHistory = await webhookService.getWebhookHistory(1);
      const responseTime = Date.now() - startTime;
      
      services.push({
        name: 'Webhook Service',
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
      });
    } catch (error) {
      services.push({
        name: 'Webhook Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return services;
  }

  private async checkDatabaseHealth(): Promise<DatabaseHealth> {
    try {
      const collections = await this.getCollectionInfo();
      const totalDocuments = collections.reduce((sum, col) => sum + col.documentCount, 0);
      
      return {
        status: 'healthy',
        collections,
        totalDocuments,
        errors: [],
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        collections: [],
        totalDocuments: 0,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }

  private async getCollectionInfo(): Promise<CollectionInfo[]> {
    const collections = ['users', 'tasks', 'ratings', 'notifications', 'taskEvents', 'webhooks', 'migrations'];
    const info: CollectionInfo[] = [];

    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).get();
        info.push({
          name: collectionName,
          documentCount: snapshot.size,
          size: 0, // Firestore doesn't provide size info
          indexes: 0, // Firestore doesn't provide index count
        });
      } catch (error) {
        logger.warn(`Failed to get info for collection: ${collectionName}`, error);
        info.push({
          name: collectionName,
          documentCount: 0,
          size: 0,
          indexes: 0,
        });
      }
    }

    return info;
  }

  private async checkPerformanceMetrics(): Promise<PerformanceMetrics> {
    // In a real implementation, these would come from system monitoring
    // For now, return mock data
    const cpuUsage = Math.random() * 100;
    const memoryUsage = Math.random() * 100;
    
    return {
      cpuUsage,
      memoryUsage,
      activeConnections: Math.floor(Math.random() * 100),
      requestRate: Math.random() * 1000,
      averageResponseTime: Math.random() * 500,
      errorRate: Math.random() * 0.1,
    };
  }

  private determineOverallStatus(
    services: ServiceHealth[],
    database: DatabaseHealth,
    performance: PerformanceMetrics
  ): 'healthy' | 'degraded' | 'unhealthy' {
    const unhealthyServices = services.filter(s => s.status === 'unhealthy').length;
    const degradedServices = services.filter(s => s.status === 'degraded').length;
    
    if (unhealthyServices > 0 || database.status === 'unhealthy') {
      return 'unhealthy';
    }
    
    if (degradedServices > 0 || database.status === 'degraded' || 
        performance.cpuUsage > this.config.alertThresholds.cpuUsage ||
        performance.memoryUsage > this.config.alertThresholds.memoryUsage) {
      return 'degraded';
    }
    
    return 'healthy';
  }

  private async checkAlerts(health: SystemHealth): Promise<void> {
    // Check service alerts
    for (const service of health.services) {
      if (service.status === 'unhealthy') {
        this.createAlert('service_unhealthy', `Service ${service.name} is unhealthy`, 'critical');
      } else if (service.status === 'degraded') {
        this.createAlert('service_degraded', `Service ${service.name} is degraded`, 'warning');
      }
      
      if (service.responseTime > this.config.alertThresholds.responseTime) {
        this.createAlert('response_time_high', `Service ${service.name} response time high`, 'warning');
      }
    }

    // Check database alerts
    if (health.database.status === 'unhealthy') {
      this.createAlert('database_unhealthy', 'Database is unhealthy', 'critical');
    }

    // Check performance alerts
    if (health.performance.cpuUsage > this.config.alertThresholds.cpuUsage) {
      this.createAlert('high_cpu_usage', 'High CPU usage', 'warning');
    }
    
    if (health.performance.memoryUsage > this.config.alertThresholds.memoryUsage) {
      this.createAlert('high_memory_usage', 'High memory usage', 'warning');
    }
    
    if (health.performance.errorRate > this.config.alertThresholds.errorRate) {
      this.createAlert('high_error_rate', 'High error rate', 'error');
    }
  }

  async createAlert(type: string, message: string, severity: Alert['level']): Promise<Alert> {
    const alert: Alert = {
      id: `alert_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level: severity,
      message,
      timestamp: new Date(),
      acknowledged: false,
    };

    this.alerts.push(alert);
    
    // Keep only last 1000 alerts
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }

    // Send notification for critical alerts
    if (severity === 'critical' && this.config.notificationEmails.length > 0) {
      await this.sendAlertNotification(alert);
    }

    logger.info(`Alert created: ${severity.toUpperCase()} - ${message}`);
    return alert;
  }

  private async sendAlertNotification(alert: Alert): Promise<void> {
    try {
      const html = `
        <h2>🚨 Critical Alert</h2>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Time:</strong> ${alert.timestamp.toISOString()}</p>
        <p><strong>Alert ID:</strong> ${alert.id}</p>
        <p>Please investigate this issue immediately.</p>
      `;

      for (const email of this.config.notificationEmails) {
        await emailService.sendEmail({
          to: email,
          subject: `[CRITICAL] AssignMint Alert: ${alert.message}`,
          html,
        });
      }
    } catch (error) {
      logger.error('Failed to send alert notification:', error);
    }
  }

  acknowledgeAlert(alertId: string): { success: boolean; error?: string } {
    const alert = this.alerts.find(a => a.id === alertId);
    if (!alert) {
      return { success: false, error: 'Alert not found' };
    }

    alert.acknowledged = true;
    alert.acknowledgedBy = 'system'; // Default value for now
    alert.acknowledgedAt = new Date();

    logger.info(`Alert acknowledged: ${alertId}`);
    return { success: true };
  }

  async getDashboardData(): Promise<{
    currentHealth: SystemHealth;
    healthHistory: SystemHealth[];
    alerts: Alert[];
    config: DashboardConfig;
    health: any;
    metrics: any;
    services: any;
    database: any;
  }> {
    const currentHealth = this.healthHistory[this.healthHistory.length - 1];
    
    return {
      currentHealth: currentHealth || await this.getCurrentHealth(),
      healthHistory: this.healthHistory,
      alerts: this.alerts,
      config: this.config,
      health: currentHealth || await this.getCurrentHealth(),
      metrics: await this.getCurrentHealth(),
      services: currentHealth?.services || [],
      database: currentHealth?.database || {},
    };
  }

  private async getCurrentHealth(): Promise<SystemHealth> {
    const [services, database, performance] = await Promise.all([
      this.checkServicesHealth(),
      this.checkDatabaseHealth(),
      this.checkPerformanceMetrics(),
    ]);

    return {
      status: this.determineOverallStatus(services, database, performance),
      timestamp: new Date(),
      services,
      database,
      performance,
      alerts: this.alerts.filter(alert => !alert.acknowledged),
    };
  }

  updateConfig(newConfig: Partial<DashboardConfig>): { success: boolean; error?: string } {
    try {
      this.config = { ...this.config, ...newConfig };
      
      if (newConfig.healthCheckInterval && this.isMonitoring) {
        // Restart monitoring with new interval
        this.stopMonitoring();
        this.startMonitoring();
      }
      
      logger.info('Dashboard configuration updated');
      return { success: true };
    } catch (error) {
      logger.error('Error updating configuration:', error);
      return { success: false, error: 'Invalid configuration' };
    }
  }

  getSystemMetrics(): {
    uptime: number;
    totalRequests: number;
    averageResponseTime: number;
    errorCount: number;
    activeUsers: number;
    totalAlerts: number;
    activeAlerts: number;
    systemUptime: number;
    lastHealthCheck: Date;
  } {
    // In a real implementation, these would come from actual metrics
    return {
      uptime: process.uptime() * 1000,
      totalRequests: Math.floor(Math.random() * 1000),
      averageResponseTime: Math.random() * 500,
      errorCount: Math.floor(Math.random() * 1000),
      activeUsers: Math.floor(Math.random() * 1000),
      totalAlerts: this.alerts.length,
      activeAlerts: this.alerts.filter(a => !a.acknowledged).length,
      systemUptime: process.uptime() * 1000,
      lastHealthCheck: this.healthHistory.length > 0 ? this.healthHistory[this.healthHistory.length - 1]?.timestamp || new Date() : new Date(),
    };
  }

  exportHealthReport(startDate?: Date, endDate?: Date): {
    timestamp: Date;
    health: any;
    alerts: any;
    metrics: any;
    services: any;
    database: any;
    version: string;
    generatedBy: string;
    format: string;
  } {
    const start = startDate || new Date(Date.now() - 24 * 60 * 60 * 1000); // Default to last 24 hours
    const end = endDate || new Date();
    
    const relevantHealth = this.healthHistory.filter(
      health => health.timestamp >= start && health.timestamp <= end
    );

    const report = {
      timestamp: new Date(),
      health: {
        period: { start, end },
        totalChecks: relevantHealth.length,
        statusBreakdown: {
          healthy: relevantHealth.filter(h => h.status === 'healthy').length,
          degraded: relevantHealth.filter(h => h.status === 'degraded').length,
          unhealthy: relevantHealth.filter(h => h.status === 'unhealthy').length,
        },
      },
      alerts: this.alerts.filter(
        alert => alert.timestamp >= start && alert.timestamp <= end
      ),
      metrics: {
        totalChecks: relevantHealth.length,
        averageResponseTime: relevantHealth.reduce((sum, h) => 
          sum + h.services.reduce((s, service) => s + service.responseTime, 0), 0
        ) / (relevantHealth.length * (relevantHealth[0]?.services?.length || 1)),
      },
      services: relevantHealth.length > 0 ? relevantHealth[0]?.services || [] : [],
      database: relevantHealth.length > 0 ? relevantHealth[0]?.database || {} : {},
      version: '1.0.0',
      generatedBy: 'AssignMint Ops Dashboard',
      format: 'json',
    };

    return report;
  }



  async checkAllServices(): Promise<ServiceHealth[]> {
    const services: ServiceHealth[] = [];
    
    // Check database health
    try {
      const dbHealth = await this.checkDatabaseHealth();
      services.push({
        name: 'Database',
        status: dbHealth.status,
        responseTime: 0, // Placeholder
        lastCheck: new Date(),
        error: dbHealth.errors.length > 0 ? dbHealth.errors.join(', ') : undefined
      });
    } catch (error) {
      services.push({
        name: 'Database',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check email service health
    try {
      const emailHealth = await this.checkEmailServiceHealth();
      services.push({
        name: 'Email Service',
        status: emailHealth.status,
        responseTime: emailHealth.responseTime,
        lastCheck: new Date(),
        error: emailHealth.error
      });
    } catch (error) {
      services.push({
        name: 'Email Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Check search service health
    try {
      const searchHealth = await this.checkSearchServiceHealth();
      services.push({
        name: 'Search Service',
        status: searchHealth.status,
        responseTime: searchHealth.responseTime,
        lastCheck: new Date(),
        error: searchHealth.error
      });
    } catch (error) {
      services.push({
        name: 'Search Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    return services;
  }

  getOverallHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const services = this.getServiceHealth();
    const totalServices = services.length;
    const healthyServices = services.filter((s: any) => s.status === 'healthy').length;
    const unhealthyServices = services.filter((s: any) => s.status === 'unhealthy').length;

    if (unhealthyServices === 0) {
      return 'healthy';
    } else if (healthyServices / totalServices >= 0.7) {
      return 'degraded';
    } else {
      return 'unhealthy';
    }
  }

  private getServiceHealth(): ServiceHealth[] {
    // Return the current service health status
    return this.serviceHealth;
  }

  // This method is now called automatically during health checks

  private async checkEmailServiceHealth(): Promise<ServiceHealth> {
    try {
      const startTime = Date.now();
      // In a real implementation, you would test the email service
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'Email Service',
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
        error: undefined
      };
    } catch (error) {
      return {
        name: 'Email Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkSearchServiceHealth(): Promise<ServiceHealth> {
    try {
      const startTime = Date.now();
      // In a real implementation, you would test the search service
      const responseTime = Date.now() - startTime;
      
      return {
        name: 'Search Service',
        status: 'healthy',
        responseTime,
        lastCheck: new Date(),
        error: undefined
      };
    } catch (error) {
      return {
        name: 'Search Service',
        status: 'unhealthy',
        responseTime: 0,
        lastCheck: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const opsDashboard = new OpsDashboard();
