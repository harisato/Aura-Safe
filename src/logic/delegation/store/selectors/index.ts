import { DELEGATION_REDUCER_ID } from 'src/logic/delegation/store/reducer'
import { AppReduxState } from 'src/logic/safe/store'
import { DelegationType } from '../reducer'

export const allDelegation = (state: AppReduxState['delegation']): DelegationType[] | [] => {
  const delegationState = state[DELEGATION_REDUCER_ID]
  return delegationState.allDelegations || []
}
