import { createSelector } from 'reselect'
import { PROPOSALS_REDUCER_ID } from 'src/logic/proposal/store/reducer/proposals'
import { AppReduxState } from 'src/store'
import { currentChainId } from 'src/logic/config/store/selectors'
import { IProposal } from 'src/types/proposal'
import { extractSafeAddress } from 'src/routes/routes'
import _ from 'lodash'

const proposalsMapSelector = (state) => state[PROPOSALS_REDUCER_ID]

export const proposalsListSelector = createSelector(proposalsMapSelector, (proposal) => proposal)

export const proposals = (state: AppReduxState): AppReduxState['proposals'] => {
  return state[PROPOSALS_REDUCER_ID]
}

export const proposalDetail = createSelector(
  proposals,
  currentChainId,
  extractSafeAddress,
  (_: AppReduxState, attrDetail: { attributeName: keyof IProposal; attributeValue: IProposal[keyof IProposal] }) =>
    attrDetail,
  (proposals, chainId, safeAddress, attrDetail): IProposal | undefined => {
    const { attributeName, attributeValue } = attrDetail

    const proposalList = chainId && safeAddress ? proposals[chainId]?.[safeAddress] : undefined

    if (!proposalList) {
      return undefined
    }
    // console.log({ attributeName, attributeValue, proposals, chainId, safeAddress, attrDetail })

    const proposal = proposalList ? _.find(proposalList, (item) => item.id === attributeValue) : undefined

    return proposal
  },
)
