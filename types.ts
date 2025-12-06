
export interface ProjectInput {
  title: string;
  location: string;
  targetAudience: string;
  sector: string;
  budget: string;
  duration: string;
  description: string;
  localPartner: string;
  technologyLevel: string;
  fundingSource: string;
  teamExperience: string;
  strategyHistory?: string[]; // New: Tracks applied pivots separately
}

export interface Metric {
  category: string;
  score: number; // 0-100
  reasoning: string;
}

export interface PivotSuggestion {
  title: string;
  modification: string;
  rationale: string;
  changes?: Partial<ProjectInput>;
}

export interface TimelineEvent {
  month: string;
  title: string;
  description: string;
  sentimentScore: number; // 0 to 100 where 50 is neutral
}

export interface BudgetItem {
  category: string;
  percentage: number;
}

export interface Stakeholder {
  group: string;
  sentiment: number; // -100 (Strongly Oppose) to 100 (Strongly Support)
  influence: string; // High, Medium, Low
}

export interface RiskAnalysis {
  risk: string;
  likelihood: number; // 1-10
  severity: number; // 1-10
}

export interface ImpactProjection {
  year: string;
  social: number;
  economic: number;
  environmental: number;
}

export interface ScheduleItem {
  task: string;
  startMonth: number;
  durationMonths: number;
  type: 'planning' | 'execution' | 'milestone';
}

export interface SimulationResult {
  // Stage 1: Immediate Summary
  overallScore: number;
  communitySentiment: number; // 0-100
  sustainabilityScore: number; // 0-100
  narrative: string;
  successFactors: string[];

  // Stage 2: Analytics (Optional while loading)
  metrics?: Metric[];
  timeline?: TimelineEvent[];
  budgetBreakdown?: BudgetItem[];
  stakeholderAnalysis?: Stakeholder[];
  riskAnalysis?: RiskAnalysis[];
  longTermImpact?: ImpactProjection[];
  risks?: string[];

  // Stage 3: Strategy (Optional while loading)
  schedule?: ScheduleItem[];
  pivots?: PivotSuggestion[];
}

export enum SimulationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
