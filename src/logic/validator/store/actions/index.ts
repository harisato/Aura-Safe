import { Action, createAction } from 'redux-actions'
import { ThunkDispatch } from 'redux-thunk'
import { getInternalChainId } from 'src/config'
import { getAllValidator } from 'src/services'
import { AppReduxState } from 'src/logic/safe/store'
import { ValidatorType } from '../reducer'

export const FETCH_ALL_VALIDATORS = 'FETCH_ALL_VALIDATORS'

export const fetchAllValidator =
  () =>
  async (dispatch: ThunkDispatch<AppReduxState, undefined, Action<ValidatorType[]>>): Promise<void> => {
    try {
      const allValidator = (await getAllValidator(getInternalChainId())) as any
      if (allValidator.Data.validators) {
        const formatedData: ValidatorType[] = allValidator.Data.validators.map(
          (validator: any): ValidatorType => ({
            name: validator.description.moniker,
            operatorAddress: validator.operatorAddress,
            picture: validator.description.picture,
            votingPower: { number: validator.votingPower.number, percentage: validator.votingPower.percentage },
          }),
        )
        dispatch(setAllValidator(formatedData))
      }
    } catch (err) {
      console.error('fetch validator error', err)
    }
    return Promise.resolve()
  }
const setAllValidator = createAction<ValidatorType[]>(FETCH_ALL_VALIDATORS)
