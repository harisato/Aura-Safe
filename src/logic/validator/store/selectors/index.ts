import { VALIDATOR_REDUCER_ID } from 'src/logic/validator/store/reducer'
import { AppReduxState } from 'src/logic/safe/store'
import { ValidatorType } from '../reducer'

export const allValidator = (state: AppReduxState['validator']): ValidatorType[] | [] => {
  const validatorState = state[VALIDATOR_REDUCER_ID]
  return validatorState.allValidators || []
}
