import { AdminService } from '../../src/admin/adminService';

describe('AdminService', () => {
  let adminService: AdminService;
  let mockFirestore: any;
  let mockAuth: any;
  let mockStorage: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockFirestore = {
      collection: jest.fn(),
      batch: jest.fn(),
    };
    
    mockAuth = {
      listUsers: jest.fn(),
      getUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      setCustomUserClaims: jest.fn(),
    };
    
    mockStorage = {
      bucket: jest.fn(),
    };
    
    adminService = new AdminService();
    
    // Mock the service dependencies
    (adminService as any).db = mockFirestore;
    (adminService as any).auth = mockAuth;
    (adminService as any).storage = mockStorage;
  });

  describe('constructor', () => {
    it('should initialize admin service', () => {
      expect(adminService).toBeDefined();
    });
  });

  describe('getSystemStats', () => {
    it('should return comprehensive system statistics', async () => {
      // Mock collection data
      const mockCollections = {
        users: { size: 100 },
        tasks: { size: 250 },
        ratings: { size: 75 },
        notifications: { size: 300 },
      };
      
      Object.entries(mockCollections).forEach(([name, data]) => {
        mockFirestore.collection.mockReturnValueOnce({
          get: jest.fn().mockResolvedValue({ size: data.size }),
        });
      });
      
      const stats = await adminService.getSystemStats();
      
      expect(stats).toBeDefined();
      expect(stats.totalUsers).toBe(100);
      expect(stats.totalTasks).toBe(250);
      expect(stats.totalRatings).toBe(75);
      expect(stats.totalNotifications).toBe(300);
      expect(stats.timestamp).toBeInstanceOf(Date);
    });

    it('should handle collection access errors gracefully', async () => {
      mockFirestore.collection.mockImplementation(() => {
        throw new Error('Collection access failed');
      });
      
      const stats = await adminService.getSystemStats();
      
      expect(stats.error).toContain('Collection access failed');
    });
  });

  describe('getUserManagement', () => {
    it('should return user management data', async () => {
      const mockUsers = [
        { uid: 'user1', email: 'user1@test.com', disabled: false },
        { uid: 'user2', email: 'user2@test.com', disabled: true },
      ];
      
      mockAuth.listUsers.mockResolvedValue({ users: mockUsers });
      
      const userManagement = await adminService.getUserManagement();
      
      expect(userManagement.totalUsers).toBe(2);
      expect(userManagement.activeUsers).toBe(1);
      expect(userManagement.disabledUsers).toBe(1);
      expect(userManagement.users).toHaveLength(2);
    });

    it('should handle auth service errors gracefully', async () => {
      mockAuth.listUsers.mockRejectedValue(new Error('Auth service failed'));
      
      const userManagement = await adminService.getUserManagement();
      
      expect(userManagement.error).toContain('Auth service failed');
    });
  });

  describe('updateUserRole', () => {
    it('should update user role successfully', async () => {
      const uid = 'user123';
      const newRole = 'admin';
      
      mockAuth.setCustomUserClaims.mockResolvedValue({});
      
      const result = await adminService.updateUserRole(uid, newRole);
      
      expect(result.success).toBe(true);
      expect(mockAuth.setCustomUserClaims).toHaveBeenCalledWith(uid, { role: newRole });
    });

    it('should handle invalid user ID', async () => {
      const result = await adminService.updateUserRole('', 'admin');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid user ID');
    });

    it('should handle invalid role', async () => {
      const result = await adminService.updateUserRole('user123', 'invalid_role');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid role');
    });

    it('should handle auth service errors', async () => {
      mockAuth.setCustomUserClaims.mockRejectedValue(new Error('Auth service failed'));
      
      const result = await adminService.updateUserRole('user123', 'admin');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Auth service failed');
    });
  });

  describe('disableUser', () => {
    it('should disable user successfully', async () => {
      const uid = 'user123';
      
      mockAuth.updateUser.mockResolvedValue({});
      
      const result = await adminService.disableUser(uid);
      
      expect(result.success).toBe(true);
      expect(mockAuth.updateUser).toHaveBeenCalledWith(uid, { disabled: true });
    });

    it('should handle invalid user ID', async () => {
      const result = await adminService.disableUser('');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid user ID');
    });

    it('should handle auth service errors', async () => {
      mockAuth.updateUser.mockRejectedValue(new Error('Auth service failed'));
      
      const result = await adminService.disableUser('user123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Auth service failed');
    });
  });

  describe('enableUser', () => {
    it('should enable user successfully', async () => {
      const uid = 'user123';
      
      mockAuth.updateUser.mockResolvedValue({});
      
      const result = await adminService.enableUser(uid);
      
      expect(result.success).toBe(true);
      expect(mockAuth.updateUser).toHaveBeenCalledWith(uid, { disabled: false });
    });

    it('should handle invalid user ID', async () => {
      const result = await adminService.enableUser('');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid user ID');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const uid = 'user123';
      
      mockAuth.deleteUser.mockResolvedValue({});
      
      const result = await adminService.deleteUser(uid);
      
      expect(result.success).toBe(true);
      expect(mockAuth.deleteUser).toHaveBeenCalledWith(uid);
    });

    it('should handle invalid user ID', async () => {
      const result = await adminService.deleteUser('');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid user ID');
    });

    it('should handle auth service errors', async () => {
      mockAuth.deleteUser.mockRejectedValue(new Error('Auth service failed'));
      
      const result = await adminService.deleteUser('user123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Auth service failed');
    });
  });

  describe('getTaskManagement', () => {
    it('should return task management data', async () => {
      const mockTasks = [
        { id: 'task1', status: 'open', createdAt: new Date() },
        { id: 'task2', status: 'in_progress', createdAt: new Date() },
        { id: 'task3', status: 'completed', createdAt: new Date() },
      ];
      
      mockFirestore.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockTasks.map(task => ({ id: task.id, data: () => task })),
        }),
      });
      
      const taskManagement = await adminService.getTaskManagement();
      
      expect(taskManagement.totalTasks).toBe(3);
      expect(taskManagement.openTasks).toBe(1);
      expect(taskManagement.inProgressTasks).toBe(1);
      expect(taskManagement.completedTasks).toBe(1);
    });

    it('should handle collection access errors gracefully', async () => {
      mockFirestore.collection.mockImplementation(() => {
        throw new Error('Collection access failed');
      });
      
      const taskManagement = await adminService.getTaskManagement();
      
      expect(taskManagement.error).toContain('Collection access failed');
    });
  });

  describe('moderateTask', () => {
    it('should moderate task successfully', async () => {
      const taskId = 'task123';
      const action = 'approve';
      const reason = 'Task approved by admin';
      
      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn(),
      };
      
      mockFirestore.batch.mockReturnValue(mockBatch);
      
      const result = await adminService.moderateTask(taskId, action, reason);
      
      expect(result.success).toBe(true);
      expect(mockBatch.update).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('should handle invalid task ID', async () => {
      const result = await adminService.moderateTask('', 'approve', 'reason');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid task ID');
    });

    it('should handle invalid action', async () => {
      const result = await adminService.moderateTask('task123', 'invalid_action', 'reason');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid action');
    });

    it('should handle batch operation errors', async () => {
      mockFirestore.batch.mockImplementation(() => {
        throw new Error('Batch operation failed');
      });
      
      const result = await adminService.moderateTask('task123', 'approve', 'reason');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Batch operation failed');
    });
  });

  describe('getContentModeration', () => {
    it('should return content moderation data', async () => {
      const mockReports = [
        { id: 'report1', type: 'inappropriate_content', status: 'pending' },
        { id: 'report2', type: 'spam', status: 'resolved' },
      ];
      
      mockFirestore.collection.mockReturnValue({
        get: jest.fn().mockResolvedValue({
          docs: mockReports.map(report => ({ id: report.id, data: () => report })),
        }),
      });
      
      const contentModeration = await adminService.getContentModeration();
      
      expect(contentModeration.totalReports).toBe(2);
      expect(contentModeration.pendingReports).toBe(1);
      expect(contentModeration.resolvedReports).toBe(1);
      expect(contentModeration.reports).toHaveLength(2);
    });

    it('should handle collection access errors gracefully', async () => {
      mockFirestore.collection.mockImplementation(() => {
        throw new Error('Collection access failed');
      });
      
      const contentModeration = await adminService.getContentModeration();
      
      expect(contentModeration.error).toContain('Collection access failed');
    });
  });

  describe('resolveReport', () => {
    it('should resolve report successfully', async () => {
      const reportId = 'report123';
      const action = 'remove_content';
      const adminNotes = 'Content removed due to policy violation';
      
      const mockBatch = {
        update: jest.fn(),
        commit: jest.fn(),
      };
      
      mockFirestore.batch.mockReturnValue(mockBatch);
      
      const result = await adminService.resolveReport(reportId, action, adminNotes);
      
      expect(result.success).toBe(true);
      expect(mockBatch.update).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('should handle invalid report ID', async () => {
      const result = await adminService.resolveReport('', 'remove_content', 'notes');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid report ID');
    });

    it('should handle invalid action', async () => {
      const result = await adminService.resolveReport('report123', 'invalid_action', 'notes');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid action');
    });
  });

  describe('getAnalytics', () => {
    it('should return analytics data', async () => {
      const analytics = await adminService.getAnalytics();
      
      expect(analytics).toBeDefined();
      expect(analytics.userGrowth).toBeDefined();
      expect(analytics.taskMetrics).toBeDefined();
      expect(analytics.revenueMetrics).toBeDefined();
      expect(analytics.timestamp).toBeInstanceOf(Date);
    });

    it('should calculate user growth trends', async () => {
      const analytics = await adminService.getAnalytics();
      
      expect(analytics.userGrowth).toBeDefined();
      expect(analytics.userGrowth.totalUsers).toBeGreaterThanOrEqual(0);
      expect(analytics.userGrowth.newUsersThisMonth).toBeGreaterThanOrEqual(0);
    });

    it('should calculate task metrics', async () => {
      const analytics = await adminService.getAnalytics();
      
      expect(analytics.taskMetrics).toBeDefined();
      expect(analytics.taskMetrics.totalTasks).toBeGreaterThanOrEqual(0);
      expect(analytics.taskMetrics.completionRate).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getSystemHealth', () => {
    it('should return system health information', async () => {
      const systemHealth = await adminService.getSystemHealth();
      
      expect(systemHealth).toBeDefined();
      expect(systemHealth.status).toBeDefined();
      expect(systemHealth.services).toBeDefined();
      expect(systemHealth.database).toBeDefined();
      expect(systemHealth.timestamp).toBeInstanceOf(Date);
    });

    it('should check all critical services', async () => {
      const systemHealth = await adminService.getSystemHealth();
      
      expect(systemHealth.services).toBeDefined();
      expect(systemHealth.services.auth).toBeDefined();
      expect(systemHealth.services.database).toBeDefined();
      expect(systemHealth.services.storage).toBeDefined();
    });
  });

  describe('getAuditLog', () => {
    it('should return audit log data', async () => {
      const mockAuditLogs = [
        { id: 'log1', action: 'user_role_updated', adminId: 'admin1', timestamp: new Date() },
        { id: 'log2', action: 'task_moderated', adminId: 'admin2', timestamp: new Date() },
      ];
      
      mockFirestore.collection.mockReturnValue({
        orderBy: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            get: jest.fn().mockResolvedValue({
              docs: mockAuditLogs.map(log => ({ id: log.id, data: () => log })),
            }),
          }),
        }),
      });
      
      const auditLog = await adminService.getAuditLog();
      
      expect(auditLog).toBeDefined();
      expect(auditLog.logs).toHaveLength(2);
      expect(auditLog.totalLogs).toBe(2);
    });

    it('should handle collection access errors gracefully', async () => {
      mockFirestore.collection.mockImplementation(() => {
        throw new Error('Collection access failed');
      });
      
      const auditLog = await adminService.getAuditLog();
      
      expect(auditLog.error).toContain('Collection access failed');
    });
  });

  describe('logAdminAction', () => {
    it('should log admin action successfully', async () => {
      const action = 'user_role_updated';
      const details = { userId: 'user123', newRole: 'admin' };
      const adminId = 'admin123';
      
      const mockBatch = {
        set: jest.fn(),
        commit: jest.fn(),
      };
      
      mockFirestore.batch.mockReturnValue(mockBatch);
      
      const result = await adminService.logAdminAction(action, details, adminId);
      
      expect(result.success).toBe(true);
      expect(mockBatch.set).toHaveBeenCalled();
      expect(mockBatch.commit).toHaveBeenCalled();
    });

    it('should handle invalid action', async () => {
      const result = await adminService.logAdminAction('', {}, 'admin123');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid action');
    });

    it('should handle invalid admin ID', async () => {
      const result = await adminService.logAdminAction('user_role_updated', {}, '');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid admin ID');
    });
  });

  describe('getBackupStatus', () => {
    it('should return backup status information', async () => {
      const backupStatus = await adminService.getBackupStatus();
      
      expect(backupStatus).toBeDefined();
      expect(backupStatus.lastBackup).toBeDefined();
      expect(backupStatus.backupSize).toBeDefined();
      expect(backupStatus.status).toBeDefined();
    });

    it('should handle backup service errors gracefully', async () => {
      // Mock backup service failure
      const mockBackupService = {
        getStatus: jest.fn().mockRejectedValue(new Error('Backup service failed')),
      };
      
      (adminService as any).backupService = mockBackupService;
      
      const backupStatus = await adminService.getBackupStatus();
      
      expect(backupStatus.error).toContain('Backup service failed');
    });
  });

  describe('initiateBackup', () => {
    it('should initiate backup successfully', async () => {
      const backupType = 'full';
      
      const mockBackupService = {
        initiateBackup: jest.fn().mockResolvedValue({ success: true, backupId: 'backup123' }),
      };
      
      (adminService as any).backupService = mockBackupService;
      
      const result = await adminService.initiateBackup(backupType);
      
      expect(result.success).toBe(true);
      expect(result.backupId).toBe('backup123');
      expect(mockBackupService.initiateBackup).toHaveBeenCalledWith(backupType);
    });

    it('should handle invalid backup type', async () => {
      const result = await adminService.initiateBackup('invalid_type');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid backup type');
    });
  });

  describe('error handling', () => {
    it('should handle missing dependencies gracefully', () => {
      expect(() => new AdminService()).not.toThrow();
    });

    it('should handle invalid parameters consistently', async () => {
      const invalidParams = [
        { uid: '', role: 'admin' },
        { uid: 'user123', role: '' },
        { taskId: '', action: 'approve' },
        { reportId: '', action: 'remove_content' },
      ];
      
      for (const params of invalidParams) {
        if ('role' in params) {
          const result = await adminService.updateUserRole(params.uid, params.role);
          expect(result.success).toBe(false);
        } else if ('taskId' in params) {
          const result = await adminService.moderateTask(params.taskId, params.action, 'reason');
          expect(result.success).toBe(false);
        } else if ('reportId' in params) {
          const result = await adminService.resolveReport(params.reportId, params.action, 'notes');
          expect(result.success).toBe(false);
        }
      }
    });
  });
});
