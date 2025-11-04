export interface LinkRequest {
  id?: number;
  user_id: number;
  game_name: string;
  tags: string[];
  description: string;
  status: LinkRequestStatus;
  createdAt?: string;
  updatedAt?: string;
  display_name: string;
  region?: string;
  platform?: string;
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum LinkRequestStatus {
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled'
}

export interface CreateLinkRequestData {
  game_name: string;
  tags: string[];
  description: string;
  platform?: string;
}

export interface LinkRequestResponse {
  success: boolean;
  data?: LinkRequest;
  error?: string;
}
