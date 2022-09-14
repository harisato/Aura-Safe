import _ from 'lodash'
import { Action, handleActions } from 'redux-actions'
import { ChainId } from 'src/config/chain'
import { ADD_OR_UPDATE_PROPOSALS } from 'src/logic/proposal/store/actions/addOrUpdateProposals'

import { ADD_PROPOSALS } from 'src/logic/proposal/store/actions/addProposal'
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

      console.log({ state })

      return {
        ...state,
        [chainId]: {
          [safeAddress]: [...proposals],
        },
      }
    },
    [ADD_OR_UPDATE_PROPOSALS]: (state, action: Action<IProposalState>) => {
      const { chainId, safeAddress, proposals } = action.payload

      if (state[chainId]) {
        const safeProposalList = _.get(state[chainId], `${safeAddress}`)

        if (safeProposalList) {
          const proposal = safeProposalList.find((proposal) => proposal.id == proposals[0].id)
          if (proposal) {
            _.assign(proposal, proposals[0])
          } else {
            safeProposalList.push(proposals[0])
          }
        } else {
          state[chainId][safeAddress] = proposals
        }
      } else {
        state[chainId] = {}
        state[chainId][safeAddress] = proposals
      }

      return {
        ...state,
        // [chainId]: {
        //   [safeAddress]: [...proposals],
        // },
      }
    },
  },
  {},
)

export { proposalsReducer, PROPOSALS_REDUCER_ID }
