import { SearchService, SearchFilters, SearchOptions, SearchResult } from '../../src/search/searchService';
import algoliasearch from 'algoliasearch';

// Mock algoliasearch
const mockAlgoliaClient = {
  initIndex: jest.fn(),
};

const mockAlgoliaSearch = algoliasearch as jest.MockedFunction<typeof algoliasearch>;

describe('SearchService', () => {
  let searchService: SearchService;
  let mockTaskIndex: any;
  let mockUserIndex: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTaskIndex = {
      setSettings: jest.fn(),
      search: jest.fn(),
      saveObject: jest.fn(),
      deleteObject: jest.fn(),
      getSettings: jest.fn(),
    };
    
    mockUserIndex = {
      setSettings: jest.fn(),
      search: jest.fn(),
      saveObject: jest.fn(),
      deleteObject: jest.fn(),
      getSettings: jest.fn(),
    };
    
    mockAlgoliaSearch.mockReturnValue(mockAlgoliaClient as any);
    mockAlgoliaClient.initIndex
      .mockReturnValueOnce(mockTaskIndex)
      .mockReturnValueOnce(mockUserIndex);
    
    searchService = new SearchService();
  });

  describe('constructor', () => {
    it('should initialize Algolia client with correct credentials', () => {
      expect(mockAlgoliaSearch).toHaveBeenCalledWith(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_API_KEY
      );
    });

    it('should initialize task and user indexes', () => {
      expect(mockAlgoliaClient.initIndex).toHaveBeenCalledWith('tasks');
      expect(mockAlgoliaClient.initIndex).toHaveBeenCalledWith('users');
    });
  });

  describe('setupIndexes', () => {
    it('should configure task index settings', async () => {
      const taskSettings = {
        searchableAttributes: ['title', 'description', 'subject'],
        attributesForFaceting: ['subject', 'status', 'price_range'],
        ranking: ['typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
      };
      
      await searchService.setupIndexes();
      
      expect(mockTaskIndex.setSettings).toHaveBeenCalledWith(taskSettings);
    });

    it('should configure user index settings', async () => {
      const userSettings = {
        searchableAttributes: ['displayName', 'bio', 'subjects', 'expertise'],
        attributesForFaceting: ['subjects', 'expertise', 'rating_range', 'subscriptionStatus'],
        ranking: ['typo', 'geo', 'words', 'filters', 'proximity', 'attribute', 'exact', 'custom'],
      };
      
      await searchService.setupIndexes();
      
      expect(mockUserIndex.setSettings).toHaveBeenCalledWith(userSettings);
    });

    it('should handle setup errors gracefully', async () => {
      mockTaskIndex.setSettings.mockRejectedValue(new Error('Setup failed'));
      
      await expect(searchService.setupIndexes()).rejects.toThrow('Setup failed');
    });
  });

  describe('searchTasks', () => {
    const mockSearchResults = {
      hits: [
        {
          objectID: 'task-1',
          title: 'Math Homework Help',
          subject: 'Mathematics',
          price: 25.00,
          status: 'open',
        },
        {
          objectID: 'task-2',
          title: 'Physics Problem Solving',
          subject: 'Physics',
          price: 30.00,
          status: 'open',
        },
      ],
      nbHits: 2,
      page: 0,
      nbPages: 1,
    };

    it('should search tasks with query and filters', async () => {
      mockTaskIndex.search.mockResolvedValue(mockSearchResults);
      
      const filters: SearchFilters = {
        subject: 'Mathematics',
        status: 'open',
        priceRange: { min: 20, max: 30 },
      };
      
      const options: SearchOptions = {
        page: 0,
        hitsPerPage: 10,
        sortBy: 'price_asc',
      };
      
      const result = await searchService.searchTasks('math homework', filters, options);
      
      expect(mockTaskIndex.search).toHaveBeenCalledWith('math homework', {
        filters: 'subject:Mathematics AND status:open AND price:20 TO 30',
        page: 0,
        hitsPerPage: 10,
        sortBy: 'price_asc',
      });
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('should handle search errors gracefully', async () => {
      mockTaskIndex.search.mockRejectedValue(new Error('Search failed'));
      
      const result = await searchService.searchTasks('test query');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Search failed');
    });

    it('should return empty results when no hits found', async () => {
      mockTaskIndex.search.mockResolvedValue({
        hits: [],
        nbHits: 0,
        page: 0,
        nbPages: 0,
      });
      
      const result = await searchService.searchTasks('nonexistent');
      
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(0);
    });
  });

  describe('searchUsers', () => {
    const mockSearchResults = {
      hits: [
        {
          objectID: 'user-1',
          displayName: 'John Doe',
          subjects: ['Mathematics', 'Physics'],
          expertise: ['Mathematics'],
          avgRating: 4.5,
        },
        {
          objectID: 'user-2',
          displayName: 'Jane Smith',
          subjects: ['Chemistry', 'Biology'],
          expertise: ['Chemistry'],
          avgRating: 4.8,
        },
      ],
      nbHits: 2,
      page: 0,
      nbPages: 1,
    };

    it('should search users with query and filters', async () => {
      mockUserIndex.search.mockResolvedValue(mockSearchResults);
      
      const filters: SearchFilters = {
        subjects: ['Mathematics'],
        expertise: ['Mathematics'],
        ratingRange: { min: 4.0, max: 5.0 },
      };
      
      const options: SearchOptions = {
        page: 0,
        hitsPerPage: 10,
        sortBy: 'rating_desc',
      };
      
      const result = await searchService.searchUsers('math tutor', filters, options);
      
      expect(mockUserIndex.search).toHaveBeenCalledWith('math tutor', {
        filters: 'subjects:Mathematics AND expertise:Mathematics AND avgRating:4.0 TO 5.0',
        page: 0,
        hitsPerPage: 10,
        sortBy: 'rating_desc',
      });
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('should handle search errors gracefully', async () => {
      mockUserIndex.search.mockRejectedValue(new Error('Search failed'));
      
      const result = await searchService.searchUsers('test query');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Search failed');
    });
  });

  describe('indexTask', () => {
    const mockTask = {
      id: 'task-123',
      title: 'Math Homework Help',
      description: 'Need help with calculus problems',
      subject: 'Mathematics',
      price: 25.00,
      status: 'open',
      deadline: new Date('2024-12-31'),
      createdAt: new Date(),
    };

    it('should index task successfully', async () => {
      mockTaskIndex.saveObject.mockResolvedValue({ objectID: 'task-123' });
      
      const result = await searchService.indexTask(mockTask);
      
      expect(mockTaskIndex.saveObject).toHaveBeenCalledWith({
        objectID: mockTask.id,
        title: mockTask.title,
        description: mockTask.description,
        subject: mockTask.subject,
        price: mockTask.price,
        status: mockTask.status,
        deadline: mockTask.deadline.toISOString(),
        createdAt: mockTask.createdAt.toISOString(),
      });
      expect(result.success).toBe(true);
    });

    it('should handle indexing errors gracefully', async () => {
      mockTaskIndex.saveObject.mockRejectedValue(new Error('Indexing failed'));
      
      const result = await searchService.indexTask(mockTask);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Indexing failed');
    });
  });

  describe('indexUser', () => {
    const mockUser = {
      uid: 'user-123',
      displayName: 'John Doe',
      bio: 'Experienced math tutor',
      subjects: ['Mathematics', 'Physics'],
      expertise: ['Mathematics'],
      avgRating: 4.5,
      totalRatings: 10,
      completedTasks: 5,
      subscriptionStatus: 'premium',
      createdAt: new Date(),
    };

    it('should index user successfully', async () => {
      mockUserIndex.saveObject.mockResolvedValue({ objectID: 'user-123' });
      
      const result = await searchService.indexUser(mockUser);
      
      expect(mockUserIndex.saveObject).toHaveBeenCalledWith({
        objectID: mockUser.uid,
        displayName: mockUser.displayName,
        bio: mockUser.bio,
        subjects: mockUser.subjects,
        expertise: mockUser.expertise,
        avgRating: mockUser.avgRating,
        totalRatings: mockUser.totalRatings,
        completedTasks: mockUser.completedTasks,
        subscriptionStatus: mockUser.subscriptionStatus,
        createdAt: mockUser.createdAt.toISOString(),
      });
      expect(result.success).toBe(true);
    });

    it('should handle indexing errors gracefully', async () => {
      mockUserIndex.saveObject.mockRejectedValue(new Error('Indexing failed'));
      
      const result = await searchService.indexUser(mockUser);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Indexing failed');
    });
  });

  describe('removeTask', () => {
    it('should remove task from index successfully', async () => {
      mockTaskIndex.deleteObject.mockResolvedValue({ taskID: 'task-123' });
      
      const result = await searchService.removeTask('task-123');
      
      expect(mockTaskIndex.deleteObject).toHaveBeenCalledWith('task-123');
      expect(result.success).toBe(true);
    });

    it('should handle removal errors gracefully', async () => {
      mockTaskIndex.deleteObject.mockRejectedValue(new Error('Removal failed'));
      
      const result = await searchService.removeTask('task-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Removal failed');
    });
  });

  describe('removeUser', () => {
    it('should remove user from index successfully', async () => {
      mockUserIndex.deleteObject.mockResolvedValue({ userID: 'user-123' });
      
      const result = await searchService.removeUser('user-123');
      
      expect(mockUserIndex.deleteObject).toHaveBeenCalledWith('user-123');
      expect(result.success).toBe(true);
    });

    it('should handle removal errors gracefully', async () => {
      mockUserIndex.deleteObject.mockRejectedValue(new Error('Removal failed'));
      
      const result = await searchService.removeUser('user-123');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Removal failed');
    });
  });

  describe('reindexAll', () => {
    it('should reindex all tasks and users', async () => {
      // Mock Firestore collections
      const mockTasks = [
        { id: 'task-1', title: 'Task 1' },
        { id: 'task-2', title: 'Task 2' },
      ];
      
      const mockUsers = [
        { uid: 'user-1', displayName: 'User 1' },
        { uid: 'user-2', displayName: 'User 2' },
      ];
      
      // Mock the service methods
      jest.spyOn(searchService, 'indexTask').mockResolvedValue({ success: true });
      jest.spyOn(searchService, 'indexUser').mockResolvedValue({ success: true });
      
      const result = await searchService.reindexAll();
      
      expect(result.success).toBe(true);
      expect(result.tasksIndexed).toBe(2);
      expect(result.usersIndexed).toBe(2);
    });

    it('should handle reindexing errors gracefully', async () => {
      jest.spyOn(searchService, 'indexTask').mockRejectedValue(new Error('Indexing failed'));
      
      const result = await searchService.reindexAll();
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Indexing failed');
    });
  });

  describe('fallbackTaskSearch', () => {
    it('should perform fallback search when Algolia is unavailable', async () => {
      const query = 'math homework';
      const filters: SearchFilters = { subject: 'Mathematics' };
      
      // Mock Firestore query
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: [
            { id: 'task-1', data: () => ({ title: 'Math Task 1' }) },
            { id: 'task-2', data: () => ({ title: 'Math Task 2' }) },
          ],
        }),
      };
      
      const result = await searchService.fallbackTaskSearch(query, filters);
      
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
    });
  });

  describe('fallbackUserSearch', () => {
    it('should perform fallback search when Algolia is unavailable', async () => {
      const query = 'math tutor';
      const filters: SearchFilters = { subjects: ['Mathematics'] };
      
      // Mock Firestore query
      const mockQuery = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        get: jest.fn().mockResolvedValue({
          docs: [
            { id: 'user-1', data: () => ({ displayName: 'Math Tutor 1' }) },
            { id: 'user-2', data: () => ({ displayName: 'Math Tutor 2' }) },
          ],
        }),
      };
      
      const result = await searchService.fallbackUserSearch(query, filters);
      
      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
    });
  });

  describe('getSearchAnalytics', () => {
    it('should return search analytics data', async () => {
      const analytics = await searchService.getSearchAnalytics();
      
      expect(analytics).toHaveProperty('totalSearches');
      expect(analytics).toHaveProperty('popularQueries');
      expect(analytics).toHaveProperty('searchPerformance');
      expect(analytics).toHaveProperty('indexStats');
    });
  });

  describe('error handling', () => {
    it('should handle missing environment variables gracefully', () => {
      const originalEnv = { ...process.env };
      
      // Temporarily remove Algolia config
      delete process.env.ALGOLIA_APP_ID;
      delete process.env.ALGOLIA_API_KEY;
      
      expect(() => new SearchService()).not.toThrow();
      
      // Restore environment
      process.env = originalEnv;
    });

    it('should handle invalid search parameters gracefully', async () => {
      const result = await searchService.searchTasks('', { subject: '' });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid search parameters');
    });
  });
});
