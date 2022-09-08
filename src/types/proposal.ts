export enum ProposalStatus {
  Rejected = 'PROPOSAL_STATUS_REJECTED',
  Passed = 'PROPOSAL_STATUS_PASSED',
  VotingPeriod = 'PROPOSAL_STATUS_VOTING_PERIOD',
  DepositPeriod = 'PROPOSAL_STATUS_DEPOSIT_PERIOD',
  Failed = 'PROPOSAL_STATUS_FAILED',
}

export type VoteLabel = 'Yes' | 'No' | 'Abstain' | 'NoWithVeto'
export type VoteKey = 'yes' | 'abstain' | 'no' | 'no_with_veto'

export enum VoteMapping {
  'yes' = 'Yes',
  'abstain' = 'No',
  'no' = 'Abstain',
  'no_with_veto' = 'NoWithVeto',
}

export interface VoteResult {
  number?: string
  name?: string
  percent: string
}

export interface Tally {
  yes: VoteResult
  abstain: VoteResult
  no: VoteResult
  noWithVeto: VoteResult
  mostVotedOn: VoteResult
}

export interface TotalDeposit {
  denom: string
  amount: string
  _id: string
}

export interface IProposal {
  id: number
  title: string
  status: ProposalStatus
  votingStart: Date
  votingEnd: Date
  submitTime: Date
  totalDeposit: TotalDeposit[]
  tally: Tally
}
export interface IProposalRes {
  proposals: IProposal[]
}
