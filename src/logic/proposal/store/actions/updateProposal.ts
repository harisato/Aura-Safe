import { createAction } from 'redux-actions'
import { IProposal } from 'src/types/proposal'

export const UPDATE_PROPOSALS = 'UPDATE_PROPOSALS'

const updateProposals = createAction<IProposal>(UPDATE_PROPOSALS)

export default updateProposals
