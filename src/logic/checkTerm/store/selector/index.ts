import { AppReduxState } from 'src/logic/safe/store'
import { TERM_ID, TermState } from '../reducer/term'

export const TermSelector = (state: AppReduxState): TermState => state[TERM_ID]
