export interface SearchFilters {
  subject?: string;
  status?: string;
  priceMin?: number;
  priceMax?: number;
  deadline?: string;
  rating?: number;
  location?: string;
  subjects?: string[];
}

export interface SearchOptions {
  query: string;
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

export interface SearchSuggestion {
  query: string;
  suggestions: string[];
}
