import { Action, handleActions } from 'redux-actions'
import { FETCH_ALL_DELEGATIONS } from '../actions/index'

export const DELEGATION_REDUCER_ID = 'delegation'

export type DelegationType = {
  operatorAddress: string
  reward?: string
  staked?: string
}

export type DelegationStateType = {
  allDelegations: DelegationType[]
}

const initialState = {
  allDelegations: [],
}

type DelegationPayloadType = DelegationStateType | DelegationType[]

const delegationReducer = handleActions<DelegationStateType, DelegationPayloadType>(
  {
    [FETCH_ALL_DELEGATIONS]: (state, action: Action<DelegationType[]>) => ({
      allDelegations: action.payload,
    }),
  },
  initialState,
)

export default delegationReducer
