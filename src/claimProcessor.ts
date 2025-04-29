import { Claim, Policy, ClaimResult } from './types';

export function evaluateClaim(
  claim: Claim,
  policies: Policy[]
): ClaimResult {
  const policy = policies.find(p => p.policyId === claim.policyId);
  if (
    !policy ||
    claim.incidentDate < policy.startDate ||
    claim.incidentDate > policy.endDate
  ) {
    return { approved: false, payout: 0, reasonCode: 'POLICY_INACTIVE' };
  }
  if (!policy.coveredIncidents.includes(claim.incidentType)) {
    return { approved: false, payout: 0, reasonCode: 'NOT_COVERED' };
  }

  const raw = claim.amountClaimed - policy.deductible;
  if (raw <= 0) {
    return { approved: false, payout: 0, reasonCode: 'ZERO_PAYOUT' };
  }

  const capped = Math.min(raw, policy.coverageLimit);
  return { approved: true, payout: capped, reasonCode: 'APPROVED' };
}