import { createSelector } from 'reselect'
import { PROPOSALS_REDUCER_ID } from 'src/logic/proposal/store/reducer/proposals'

const proposalsMapSelector = (state) => state[PROPOSALS_REDUCER_ID]

export const proposalsListSelector = createSelector(proposalsMapSelector, (proposal) => proposal.toList())
