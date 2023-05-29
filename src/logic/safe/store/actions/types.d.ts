import { ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'

import { AppReduxState } from 'src/logic/safe/store'

export type DispatchReturn = string | undefined

export type Dispatch = ThunkDispatch<AppReduxState, DispatchReturn, AnyAction>
