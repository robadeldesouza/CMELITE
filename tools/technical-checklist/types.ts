export type TechArea = 
  | 'BUILD_INFRA' 
  | 'SECURITY' 
  | 'STATE_MANAGEMENT' 
  | 'PERFORMANCE' 
  | 'ARCHITECTURE' 
  | 'UX_PATTERNS';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DecisionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'DEFERRED';

export interface TechChecklistItem {
  id: string;
  area: TechArea;
  topic: string;
  currentStatus: string;
  technicalRisk: RiskLevel;
  impact: string;
  recommendation: string;
  decision: DecisionStatus;
  notes?: string;
}

export interface TechAuditState {
  items: TechChecklistItem[];
  lastUpdated: number;
}