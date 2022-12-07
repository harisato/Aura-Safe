import { createAction } from 'redux-actions'
import { IProposalState } from 'src/logic/proposal/store/reducer/proposals'

export const ADD_OR_UPDATE_PROPOSALS = 'ADD_OR_UPDATE_PROPOSALS'

const addOrUpdateProposals = createAction<IProposalState>(ADD_OR_UPDATE_PROPOSALS)

export default addOrUpdateProposals
