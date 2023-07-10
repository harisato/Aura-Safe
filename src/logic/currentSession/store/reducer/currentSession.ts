import { Action, handleActions } from 'redux-actions'

import { LOAD_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/loadCurrentSession'
import { UPDATE_VIEWED_SAFES } from 'src/logic/currentSession/store/actions/updateViewedSafes'
import { CLEAR_CURRENT_SESSION } from 'src/logic/currentSession/store/actions/clearCurrentSession'
import { saveCurrentSessionToStorage } from 'src/logic/currentSession/utils'
import { REMOVE_VIEWED_SAFE } from '../actions/removeViewedSafe'

export const CURRENT_SESSION_REDUCER_ID = 'currentSession'
const MAX_VIEWED_SAFES = 1

export type ViewdSafeType = { safeAddress: string; safeId?: string }

export type CurrentSessionState = {
  viewedSafes: ViewdSafeType[]
  restored: boolean
}

const initialState = {
  viewedSafes: [],
  restored: false,
}

type CurrentSessionPayloads = CurrentSessionState | ViewdSafeType

const currentSessionReducer = handleActions<CurrentSessionState, CurrentSessionPayloads>(
  {
    [LOAD_CURRENT_SESSION]: (state = initialState, action: Action<CurrentSessionState>) => ({
      ...state,
      ...action.payload,
      restored: true,
    }),
    [UPDATE_VIEWED_SAFES]: (state, action: Action<ViewdSafeType>) => {
      const newState = {
        ...state,
        viewedSafes: [action.payload],
      }

      saveCurrentSessionToStorage(newState)

      return newState
    },
    [REMOVE_VIEWED_SAFE]: (state, action: Action<ViewdSafeType>) => {
      const { safeAddress } = action.payload
      const newState = {
        ...state,
        viewedSafes: state.viewedSafes.filter((item) => item.safeAddress !== safeAddress),
      }

      saveCurrentSessionToStorage(newState)

      return newState
    },
    [CLEAR_CURRENT_SESSION]: () => {
      return initialState
    },
  },
  initialState,
)

export default currentSessionReducer
