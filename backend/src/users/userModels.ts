export interface UserProfile {
  id: string;
  displayName: string;
  avatar?: string | undefined;
  bio?: string | undefined;
  subjects: string[];
  avgRating: number;
  totalRatings: number;
  completedTasks: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileRequest {
  displayName?: string;
  avatar?: string;
  bio?: string;
  subjects?: string[];
}

export interface UserStats {
  postedTasks: number;
  claimedTasks: number;
  completedTasks: number;
  earnings: number;
  avgRating: number;
  totalRatings: number;
}
