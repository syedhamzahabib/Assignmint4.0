import algoliasearch from 'algoliasearch';
import { logger } from '../utils/logger';
import { db } from '../index';
import * as admin from 'firebase-admin';

export interface SearchFilters {
  subject?: string;
  subjects?: string[];
  status?: string;
  priceMin?: number;
  priceMax?: number;
  deadline?: string;
  rating?: number;
  location?: string;
}

export interface SearchOptions {
  query?: string;
  filters?: Partial<SearchFilters>;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  type: 'task' | 'user';
  data: any;
  score: number;
}

export class SearchService {
  private client: any;
  private tasksIndex: any;
  private usersIndex: any;

  constructor() {
    const appId = process.env['ALGOLIA_APP_ID'] || '';
    const apiKey = process.env['ALGOLIA_ADMIN_API_KEY'] || '';
    
    if (!appId || !apiKey) {
      logger.warn('Algolia credentials not configured, search service will be limited');
      this.client = null as any;
      this.tasksIndex = null as any;
      this.usersIndex = null as any;
      return;
    }

    this.client = algoliasearch(appId, apiKey);
    this.tasksIndex = this.client.initIndex('tasks');
    this.usersIndex = this.client.initIndex('users');
    
    this.setupIndexes();
  }

  private async setupIndexes(): Promise<void> {
    try {
      // Configure tasks index
      await this.tasksIndex.setSettings({
        searchableAttributes: [
          'title',
          'description',
          'subject',
          'tags',
          'ownerName',
          'expertName'
        ],
        attributesForFaceting: [
          'subject',
          'status',
          'price',
          'deadline',
          'rating',
          'location'
        ],
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ],
        customRanking: [
          'desc(deadline)',
          'desc(rating)',
          'desc(createdAt)'
        ]
      });

      // Configure users index
      await this.usersIndex.setSettings({
        searchableAttributes: [
          'displayName',
          'bio',
          'subjects',
          'expertise',
          'location'
        ],
        attributesForFaceting: [
          'subjects',
          'rating',
          'expertise',
          'location',
          'subscriptionStatus'
        ],
        ranking: [
          'typo',
          'geo',
          'words',
          'filters',
          'proximity',
          'attribute',
          'exact',
          'custom'
        ],
        customRanking: [
          'desc(rating)',
          'desc(completedTasks)',
          'desc(createdAt)'
        ]
      });

      logger.info('Algolia indexes configured successfully');
    } catch (error) {
      logger.error('Failed to configure Algolia indexes:', error);
    }
  }

  async searchTasks(options: SearchOptions): Promise<SearchResult[]> {
    try {
      if (!this.tasksIndex) {
        return this.fallbackTaskSearch(options);
      }

      const searchParams: any = {
        query: options.query || '',
        page: (options.page || 1) - 1,
        hitsPerPage: options.limit || 20,
      };

      // Apply filters
      if (options.filters) {
        const filters: string[] = [];
        
        if (options.filters.subject) {
          filters.push(`subject:${options.filters.subject}`);
        }
        if (options.filters.status) {
          filters.push(`status:${options.filters.status}`);
        }
        if (options.filters.priceMin !== undefined || options.filters.priceMax !== undefined) {
          if (options.filters.priceMin !== undefined && options.filters.priceMax !== undefined) {
            filters.push(`price:${options.filters.priceMin} TO ${options.filters.priceMax}`);
          } else if (options.filters.priceMin !== undefined) {
            filters.push(`price >= ${options.filters.priceMin}`);
          } else if (options.filters.priceMax !== undefined) {
            filters.push(`price <= ${options.filters.priceMax}`);
          }
        }
        if (options.filters.rating) {
          filters.push(`rating >= ${options.filters.rating}`);
        }
        if (options.filters.location) {
          filters.push(`location:${options.filters.location}`);
        }

        if (filters.length > 0) {
          searchParams.filters = filters.join(' AND ');
        }
      }

      // Apply sorting
      if (options.sortBy) {
        switch (options.sortBy) {
          case 'deadline':
            searchParams.sortFacetBy = 'deadline';
            break;
          case 'price':
            searchParams.sortFacetBy = 'price';
            break;
          case 'rating':
            searchParams.sortFacetBy = 'rating';
            break;
          case 'createdAt':
            searchParams.sortFacetBy = 'createdAt';
            break;
        }
      }

      const results = await this.tasksIndex.search(searchParams.query, searchParams);
      
      return results.hits.map((hit: any) => ({
        id: hit.objectID,
        type: 'task' as const,
        data: hit,
        score: hit._score || 0,
      }));
    } catch (error) {
      logger.error('Error searching tasks:', error);
      return this.fallbackTaskSearch(options);
    }
  }

  async searchUsers(options: SearchOptions): Promise<SearchResult[]> {
    try {
      if (!this.usersIndex) {
        return this.fallbackUserSearch(options);
      }

      const searchParams: any = {
        query: options.query || '',
        page: (options.page || 1) - 1,
        hitsPerPage: options.limit || 20,
      };

      // Apply filters
      if (options.filters) {
        const filters: string[] = [];
        
        if (options.filters.subjects) {
          filters.push(`subjects:${options.filters.subjects}`);
        }
        if (options.filters.rating) {
          filters.push(`avgRating >= ${options.filters.rating}`);
        }
        if (options.filters.location) {
          filters.push(`location:${options.filters.location}`);
        }

        if (filters.length > 0) {
          searchParams.filters = filters.join(' AND ');
        }
      }

      // Apply sorting
      if (options.sortBy) {
        switch (options.sortBy) {
          case 'rating':
            searchParams.sortFacetBy = 'avgRating';
            break;
          case 'completedTasks':
            searchParams.sortFacetBy = 'completedTasks';
            break;
          case 'createdAt':
            searchParams.sortFacetBy = 'createdAt';
            break;
        }
      }

      const results = await this.usersIndex.search(searchParams.query, searchParams);
      
      return results.hits.map((hit: any) => ({
        id: hit.objectID,
        type: 'user' as const,
        data: hit,
        score: hit._score || 0,
      }));
    } catch (error) {
      logger.error('Error searching users:', error);
      return this.fallbackUserSearch(options);
    }
  }

  async indexTask(taskId: string, taskData: any): Promise<boolean> {
    try {
      if (!this.tasksIndex) {
        logger.warn('Algolia not configured, skipping task indexing');
        return false;
      }

      const searchableData = {
        objectID: taskId,
        title: taskData.title,
        description: taskData.description,
        subject: taskData.subject,
        status: taskData.status,
        price: taskData.price,
        deadline: taskData.deadline,
        rating: taskData.rating || 0,
        location: taskData.location,
        tags: taskData.tags || [],
        ownerName: taskData.ownerName,
        expertName: taskData.expertName,
        createdAt: taskData.createdAt,
        updatedAt: taskData.updatedAt,
      };

      await this.tasksIndex.saveObject(searchableData);
      logger.info(`Task indexed successfully: ${taskId}`);
      return true;
    } catch (error) {
      logger.error('Error indexing task:', error);
      return false;
    }
  }

  async indexUser(userId: string, userData: any): Promise<boolean> {
    try {
      if (!this.usersIndex) {
        logger.warn('Algolia not configured, skipping user indexing');
        return false;
      }

      const searchableData = {
        objectID: userId,
        displayName: userData.displayName,
        bio: userData.bio,
        subjects: userData.subjects || [],
        expertise: userData.expertise || [],
        avgRating: userData.avgRating || 0,
        completedTasks: userData.completedTasks || 0,
        location: userData.location,
        subscriptionStatus: userData.subscriptionStatus,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };

      await this.usersIndex.saveObject(searchableData);
      logger.info(`User indexed successfully: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error indexing user:', error);
      return false;
    }
  }

  async removeTask(taskId: string): Promise<boolean> {
    try {
      if (!this.tasksIndex) {
        return false;
      }

      await this.tasksIndex.deleteObject(taskId);
      logger.info(`Task removed from index: ${taskId}`);
      return true;
    } catch (error) {
      logger.error('Error removing task from index:', error);
      return false;
    }
  }

  async removeUser(userId: string): Promise<boolean> {
    try {
      if (!this.usersIndex) {
        return false;
      }

      await this.usersIndex.deleteObject(userId);
      logger.info(`User removed from index: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error removing user from index:', error);
      return false;
    }
  }

  async reindexAll(): Promise<{ tasks: number; users: number }> {
    try {
      let taskCount = 0;
      let userCount = 0;

      // Reindex all tasks
      const tasksSnapshot = await db.collection('tasks').get();
      for (const doc of tasksSnapshot.docs) {
        const taskData = doc.data();
        if (await this.indexTask(doc.id, taskData)) {
          taskCount++;
        }
      }

      // Reindex all users
      const usersSnapshot = await db.collection('users').get();
      for (const doc of usersSnapshot.docs) {
        const userData = doc.data();
        if (await this.indexUser(doc.id, userData)) {
          userCount++;
        }
      }

      logger.info(`Reindexing completed: ${taskCount} tasks, ${userCount} users`);
      return { tasks: taskCount, users: userCount };
    } catch (error) {
      logger.error('Error during reindexing:', error);
      return { tasks: 0, users: 0 };
    }
  }

  // Fallback search methods when Algolia is not available
  private async fallbackTaskSearch(options: SearchOptions): Promise<SearchResult[]> {
    return new Promise(async (resolve) => {
      try {
        const db = admin.firestore();
        let queryRef: any = db.collection('tasks');

        // Apply filters
        if (options.filters?.subject) {
          queryRef = queryRef.where('subject', '==', options.filters.subject);
        }
        if (options.filters?.status) {
          queryRef = queryRef.where('status', '==', options.filters.status);
        }
        if (options.filters?.priceMin !== undefined) {
          queryRef = queryRef.where('price', '>=', options.filters.priceMin);
        }
        if (options.filters?.priceMax !== undefined) {
          queryRef = queryRef.where('price', '<=', options.filters.priceMax);
        }

        const snapshot = await queryRef.get();
        const results = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          score: 0.5 // Fallback score
        }));

        resolve(results);
      } catch (error) {
        logger.error('Fallback task search failed:', error);
        resolve([]);
      }
    });
  }

  private async fallbackUserSearch(options: SearchOptions): Promise<SearchResult[]> {
    return new Promise(async (resolve) => {
      try {
        const db = admin.firestore();
        let queryRef: any = db.collection('users');

        // Apply filters
        if (options.filters?.subjects && options.filters.subjects.length > 0) {
          queryRef = queryRef.where('subjects', 'array-contains-any', options.filters.subjects);
        }
        if (options.filters?.rating !== undefined) {
          queryRef = queryRef.where('avgRating', '>=', options.filters.rating);
        }

        const snapshot = await queryRef.get();
        const results = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          score: 0.5 // Fallback score
        }));

        resolve(results);
      } catch (error) {
        logger.error('Fallback user search failed:', error);
        resolve([]);
      }
    });
  }

  async getSearchAnalytics(): Promise<any> {
    try {
      if (!this.tasksIndex || !this.usersIndex) {
        return { error: 'Algolia not configured' };
      }

      const [tasksStats, usersStats] = await Promise.all([
        this.tasksIndex.getSettings(),
        this.usersIndex.getSettings(),
      ]);

      return {
        tasks: {
          totalRecords: tasksStats.pagination?.totalPages || 0,
          searchableAttributes: tasksStats.searchableAttributes,
          attributesForFaceting: tasksStats.attributesForFaceting,
        },
        users: {
          totalRecords: usersStats.pagination?.totalPages || 0,
          searchableAttributes: usersStats.searchableAttributes,
          attributesForFaceting: usersStats.attributesForFaceting,
        },
      };
    } catch (error) {
      logger.error('Error getting search analytics:', error);
      return { error: 'Failed to get search analytics' };
    }
  }

  async getUserSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      if (this.client && this.usersIndex) {
        const { hits } = await this.usersIndex.search(query, {
          hitsPerPage: limit,
          attributesToRetrieve: ['displayName', 'email', 'subjects']
        });
        
        return hits.map((hit: any) => hit.displayName || hit.email || 'Unknown User');
      } else {
        // Fallback to Firestore
        const db = admin.firestore();
        const snapshot = await db.collection('users')
          .where('displayName', '>=', query)
          .where('displayName', '<=', query + '\uf8ff')
          .limit(limit)
          .get();
        
        return snapshot.docs.map((doc: any) => doc.data().displayName || doc.data().email || 'Unknown User');
      }
    } catch (error) {
      logger.error('Error getting user suggestions:', error);
      return [];
    }
  }

  async getTaskSuggestions(query: string, limit: number = 5): Promise<string[]> {
    try {
      if (this.client && this.tasksIndex) {
        const { hits } = await this.tasksIndex.search(query, {
          hitsPerPage: limit,
          attributesToRetrieve: ['title', 'subject', 'description']
        });
        
        return hits.map((hit: any) => hit.title || hit.subject || 'Untitled Task');
      } else {
        // Fallback to Firestore
        const db = admin.firestore();
        const snapshot = await db.collection('tasks')
          .where('title', '>=', query)
          .where('title', '<=', query + '\uf8ff')
          .limit(limit)
          .get();
        
        return snapshot.docs.map((doc: any) => doc.data().title || doc.data().subject || 'Untitled Task');
      }
    } catch (error) {
      logger.error('Error getting task suggestions:', error);
      return [];
    }
  }
}

export const searchService = new SearchService();
