import { createAction } from 'redux-actions'
import { TermPayload, TermValuePayload } from '../reducer/term'

export const SET_TERM = 'SET_TERM'

export const SET_VALUE_TERM = 'SET_VALUE_TERM'

export const setTerm = createAction<TermPayload>(SET_TERM)

export const setValueTerm = createAction<TermValuePayload>(SET_VALUE_TERM)
