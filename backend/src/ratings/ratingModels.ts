export interface Rating {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: Date;
}

export interface CreateRatingRequest {
  rating: number;
  comment: string;
}

export interface RatingListResponse {
  ratings: Rating[];
  total: number;
  averageRating: number;
}

export interface UserRatingSummary {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
}
