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

export interface Amount {
  denom: string
  amount: string
}

export interface ProposalContent {
  ['@type']: string
  title: string
  description: string
  recipient: string
  amount: Amount[]
}

export interface FinalTallyResult {
  yes: string
  abstain: string
  no: string
  no_with_veto: string
}

export interface TotalDeposit {
  denom: string
  amount: string
}

export interface IProposal {
  proposal_id: string
  content: ProposalContent
  status: string | ProposalStatus
  final_tally_result: FinalTallyResult
  submit_time: string
  deposit_end_time: string
  total_deposit: TotalDeposit[]
  voting_start_time: string
  voting_end_time: string
}
export interface IProposalRes {
  pagination: any
  proposals: IProposal[]
}
