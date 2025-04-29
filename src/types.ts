export type IncidentType = 'accident' | 'theft' | 'fire' | 'water damage';

export interface Policy {
  policyId: string;
  startDate: Date;
  endDate: Date;
  deductible: number;
  coverageLimit: number;
  coveredIncidents: IncidentType[];
}

export interface Claim {
  policyId: string;
  incidentType: IncidentType;
  incidentDate: Date;
  amountClaimed: number;
}

export type ReasonCode =
  | 'APPROVED'
  | 'POLICY_INACTIVE'
  | 'NOT_COVERED'
  | 'ZERO_PAYOUT';

export interface ClaimResult {
  approved: boolean;
  payout: number;
  reasonCode: ReasonCode;
}