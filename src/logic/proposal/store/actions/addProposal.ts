/* eslint-disable @typescript-eslint/ban-types */
import { createAction } from 'redux-actions'
import { IProposalState } from 'src/logic/proposal/store/reducer/proposals'

export const ADD_PROPOSALS = 'ADD_PROPOSALS'

const addProposals = createAction<IProposalState>(ADD_PROPOSALS)

export default addProposals
