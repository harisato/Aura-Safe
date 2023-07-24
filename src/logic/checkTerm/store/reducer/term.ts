import { Action, handleActions } from 'redux-actions'
import { SET_TERM, SET_VALUE_TERM } from '../actions/setTerm'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
export const TERM_ID = 'TERM'

export type TermState = {
  checkTerm: boolean
  termValue: any
}

export const TermInitialState = {
  checkTerm: false,
  termValue: null,
}

export type TermPayload = { checkTerm: boolean }

type TermValuePayload = { termValue: any }

const termReducer = handleActions<TermState>(
  {
    [SET_TERM]: (state, action: Action<TermPayload>) => {
      const { checkTerm } = action.payload
      state.checkTerm = checkTerm
      // state.termValue = termValue
      return state
    },
    [SET_VALUE_TERM]: (state, action: Action<TermValuePayload>) => {
      const { termValue } = action.payload
      state.termValue = termValue
      return state
    },
  },
  TermInitialState,
)

export default termReducer
