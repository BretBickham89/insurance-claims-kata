import { evaluateClaim } from './claimProcessor';
import { Claim, Policy, ClaimResult } from './types';

const policies: Policy[] = [
  {
    policyId: 'POL1',
    startDate: new Date('2020-01-01'),
    endDate: new Date('2021-01-01'),
    deductible: 100,
    coverageLimit: 1000,
    coveredIncidents: ['fire']
  }
];

test('rejects if policy inactive on incidentDate', () => {
  const claim: Claim = {
    policyId: 'POL1',
    incidentType: 'fire',
    incidentDate: new Date('2022-01-01'),
    amountClaimed: 500
  };
  const expected: ClaimResult = {
    approved: false,
    payout: 0,
    reasonCode: 'POLICY_INACTIVE'
  };
  expect(evaluateClaim(claim, policies)).toEqual(expected);
});

test('rejects if incidentType not covered', () => {
  const claim: Claim = {
    policyId: 'POL1',
    incidentType: 'theft',
    incidentDate: new Date('2020-06-01'),
    amountClaimed: 500
  };
  const expected: ClaimResult = {
    approved: false,
    payout: 0,
    reasonCode: 'NOT_COVERED'
  };
  expect(evaluateClaim(claim, policies)).toEqual(expected);
});

test('approves and calculates payout = amountClaimed - deductible', () => {
  const claim: Claim = {
    policyId: 'POL1',
    incidentType: 'fire',
    incidentDate: new Date('2020-06-01'),
    amountClaimed: 600
  };
  const expected: ClaimResult = {
    approved: true,
    payout: 600 - 100,
    reasonCode: 'APPROVED'
  };
  expect(evaluateClaim(claim, policies)).toEqual(expected);
});

test('caps payout at coverageLimit', () => {
  const claim: Claim = {
    policyId: 'POL1',
    incidentType: 'fire',
    incidentDate: new Date('2020-06-01'),
    amountClaimed: 2000
  };
  const expected: ClaimResult = {
    approved: true,
    payout: 1000,  
    reasonCode: 'APPROVED'
  };
  expect(evaluateClaim(claim, policies)).toEqual(expected);
});