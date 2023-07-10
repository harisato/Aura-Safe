import { Action, createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { getInternalChainId } from 'src/config'
import { extractSafeAddress } from 'src/routes/routes'
import { getAllDelegateOfUser } from 'src/services'
import { AppReduxState } from 'src/logic/safe/store'
import { DelegationType } from '../reducer'

export const FETCH_ALL_DELEGATIONS = 'FETCH_ALL_DELEGATIONS'

export const fetchAllDelegations =
  () =>
  async (dispatch: ThunkDispatch<AppReduxState, undefined, Action<DelegationType[]>>): Promise<void> => {
    try {
      const safeAddress = extractSafeAddress()
      const internalChainId = getInternalChainId()
      const allDelegation = (await getAllDelegateOfUser(internalChainId, safeAddress)) as any
      if (allDelegation.Data.delegations) {
        const formatedData: DelegationType[] = allDelegation.Data.delegations.map(
          (delegation: any): DelegationType => ({
            operatorAddress: delegation.operatorAddress,
            reward: delegation.reward[0]?.amount,
            staked: delegation.balance?.amount,
          }),
        )
        dispatch(setAllDelegation(formatedData))
      }
    } catch (err) {
      console.error('fetch delegation error', err)
    }
    return Promise.resolve()
  }
const setAllDelegation = createAction<DelegationType[]>(FETCH_ALL_DELEGATIONS)
