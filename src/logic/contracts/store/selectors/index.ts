import { createSelector } from 'reselect'
import { FUNDS_REDUCER_ID } from '../reducer'

const fundsSelector = (state) => state[FUNDS_REDUCER_ID]

export const getFunds = createSelector(fundsSelector, (state) => state.funds)
