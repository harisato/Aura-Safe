import { Action, handleActions } from 'redux-actions'
import { ChainId } from 'src/config/chain'

import { ADD_PROPOSALS } from 'src/logic/proposal/store/actions/addProposal'
import { UPDATE_PROPOSALS } from 'src/logic/proposal/store/actions/updateProposal'
import { IProposal } from 'src/types/proposal'

const PROPOSALS_REDUCER_ID = 'proposals'

export interface IProposalState {
  chainId: ChainId
  safeAddress: string
  proposals: IProposal[]
}

type Payloads = IProposalState | IProposal

type ProposalsState = Record<ChainId, Record<string, IProposal[]>>

const proposalsReducer = handleActions<ProposalsState, Payloads>(
  {
    [ADD_PROPOSALS]: (state, action: Action<IProposalState>) => {
      const { chainId, proposals, safeAddress } = action.payload
      console.log({ chainId, proposals, safeAddress })

      return {
        ...state,
        [chainId]: {
          [safeAddress]: [...proposals],
        },
      }
    },
    [UPDATE_PROPOSALS]: (state, action: Action<IProposal>) => {
      const { payload } = action

      console.log(payload)

      return {
        ...state,
      }
    },
  },
  {},
)

export { proposalsReducer, PROPOSALS_REDUCER_ID }
