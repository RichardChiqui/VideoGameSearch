export interface LinkRequest {
  id?: number;
  user_id: number;
  game_name: string;
  tags: string[];
  skill_level: SkillLevel;
  status: LinkRequestStatus;
  createdAt?: string;
  updatedAt?: string;
  display_name: string;
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
  skill_level: SkillLevel;
}

export interface LinkRequestResponse {
  success: boolean;
  data?: LinkRequest;
  error?: string;
}
