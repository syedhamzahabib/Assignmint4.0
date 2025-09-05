// src/utils/matching/score.ts - Expert scoring algorithm for task matching
import { Task, ExpertUser } from '../../types';

// Helper functions
export const clamp01 = (value: number): number => {
  return Math.max(0, Math.min(1, value));
};

export const mapLinear = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const normalized = (value - inMin) / (inMax - inMin);
  return outMin + normalized * (outMax - outMin);
};

export interface ScoringWeights {
  subjectFit: number;
  priceFit: number;
  deadlineFit: number;
  rating: number;
  acceptRate: number;
  avgResponseSpeed: number;
  levelMatch: number;
  historicalSuccess: number;
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  subjectFit: 0.25,
  priceFit: 0.15,
  deadlineFit: 0.15,
  rating: 0.15,
  acceptRate: 0.10,
  avgResponseSpeed: 0.10,
  levelMatch: 0.05,
  historicalSuccess: 0.05,
};

export interface ScoringSignals {
  subjectFit: number;
  priceFit: number;
  deadlineFit: number;
  rating: number;
  acceptRate: number;
  avgResponseSpeed: number;
  levelMatch: number;
  historicalSuccess: number;
}

export interface ScoringResult {
  totalScore: number;
  signals: ScoringSignals;
  breakdown: Record<string, { score: number; weight: number; weightedScore: number }>;
}

/**
 * Calculate how well an expert fits a specific task
 * @param task The task to match
 * @param expert The expert to evaluate
 * @param weights Optional custom weights (uses defaults if not provided)
 * @returns Scoring result with total score and breakdown
 */
export const scoreExpertForTask = (
  task: Task,
  expert: ExpertUser,
  weights: Partial<ScoringWeights> = {}
): ScoringResult => {
  const finalWeights = { ...DEFAULT_WEIGHTS, ...weights };
  
  // Calculate individual signals (0-1 scale)
  const signals: ScoringSignals = {
    subjectFit: calculateSubjectFit(task, expert),
    priceFit: calculatePriceFit(task, expert),
    deadlineFit: calculateDeadlineFit(task, expert),
    rating: calculateRatingScore(expert),
    acceptRate: calculateAcceptRateScore(expert),
    avgResponseSpeed: calculateResponseSpeedScore(expert),
    levelMatch: calculateLevelMatch(task, expert),
    historicalSuccess: calculateHistoricalSuccess(task, expert),
  };

  // Calculate weighted scores
  const breakdown: Record<string, { score: number; weight: number; weightedScore: number }> = {};
  let totalScore = 0;

  Object.entries(signals).forEach(([key, score]) => {
    const weight = finalWeights[key as keyof ScoringWeights];
    const weightedScore = score * weight;
    breakdown[key] = { score, weight, weightedScore };
    totalScore += weightedScore;
  });

  return {
    totalScore: clamp01(totalScore),
    signals,
    breakdown,
  };
};

// Individual signal calculations
function calculateSubjectFit(task: Task, expert: ExpertUser): number {
  // Check if expert has the subject in their list
  if (expert.subjects.includes(task.subject)) {
    return 1.0;
  }
  
  // Check if they have completed at least 2 tasks in this subject
  const completedCount = expert.completedBySubject[task.subject] || 0;
  if (completedCount >= 2) {
    return 1.0;
  }
  
  return 0.0;
}

function calculatePriceFit(task: Task, expert: ExpertUser): number {
  if (!expert.minPrice || !expert.maxPrice) {
    return 0.5; // Default to neutral if no price range
  }

  const taskPrice = task.price;
  
  // Perfect fit if within range
  if (taskPrice >= expert.minPrice && taskPrice <= expert.maxPrice) {
    return 1.0;
  }
  
  // Check if within ±20%
  const range = expert.maxPrice - expert.minPrice;
  const midPoint = expert.minPrice + range / 2;
  const tolerance = range * 0.2;
  
  if (Math.abs(taskPrice - midPoint) <= tolerance) {
    return 0.5;
  }
  
  return 0.0;
}

function calculateDeadlineFit(task: Task, expert: ExpertUser): number {
  // For now, assume experts can deliver within 24 hours
  // In a real system, this would be based on expert's "deliverInHours" field
  const now = new Date();
  const deadline = new Date(task.deadlineISO);
  const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  // Assume expert needs at least 2 hours to deliver
  const minDeliveryTime = 2;
  
  if (hoursUntilDeadline >= minDeliveryTime) {
    return 1.0;
  } else if (hoursUntilDeadline >= minDeliveryTime * 0.5) {
    return 0.4;
  }
  
  return 0.0;
}

function calculateRatingScore(expert: ExpertUser): number {
  // Map 3.5-5.0 rating to 0-1 scale
  return clamp01(mapLinear(expert.ratingAvg, 3.5, 5.0, 0, 1));
}

function calculateAcceptRateScore(expert: ExpertUser): number {
  // Floor at 10 invites for reliability
  if (expert.ratingCount < 10) {
    return 0.5; // Default if not enough data
  }
  
  return expert.acceptRate;
}

function calculateResponseSpeedScore(expert: ExpertUser): number {
  const responseMins = expert.medianResponseMins;
  
  // Map response times: ≤5min→1.0, 2h→0.2, linear clamp
  if (responseMins <= 5) return 1.0;
  if (responseMins >= 120) return 0.2;
  
  return mapLinear(responseMins, 5, 120, 1.0, 0.2);
}

function calculateLevelMatch(task: Task, expert: ExpertUser): number {
  // For now, assume all experts can handle all levels
  // In a real system, this would check task.level against expert's capabilities
  return 1.0;
}

function calculateHistoricalSuccess(task: Task, expert: ExpertUser): number {
  const completedCount = expert.completedBySubject[task.subject] || 0;
  
  // Normalize: 0 tasks = 0.5, 10+ tasks = 1.0
  return clamp01(mapLinear(completedCount, 0, 10, 0.5, 1.0));
}

/**
 * Rank experts by their score for a specific task
 * @param task The task to match
 * @param experts Array of experts to rank
 * @param weights Optional custom weights
 * @returns Sorted array of experts with their scores
 */
export const rankExperts = (
  task: Task,
  experts: ExpertUser[],
  weights?: Partial<ScoringWeights>
): Array<{ expert: ExpertUser; score: number; breakdown: any }> => {
  return experts
    .map(expert => {
      const result = scoreExpertForTask(task, expert, weights);
      return {
        expert,
        score: result.totalScore,
        breakdown: result.breakdown,
      };
    })
    .sort((a, b) => b.score - a.score); // Highest score first
};

/**
 * Get eligible experts for a task based on basic criteria
 * @param task The task to match
 * @param experts Array of all experts
 * @returns Filtered array of eligible experts
 */
export const getEligibleExperts = (task: Task, experts: ExpertUser[]): ExpertUser[] => {
  return experts.filter(expert => {
    // Must have the subject
    if (!expert.subjects.includes(task.subject)) {
      return false;
    }
    
    // Must have reasonable rating
    if (expert.ratingAvg < 3.0) {
      return false;
    }
    
    // Must have some experience
    if (expert.ratingCount < 3) {
      return false;
    }
    
    return true;
  });
};
