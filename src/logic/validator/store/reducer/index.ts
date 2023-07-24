import { Action, handleActions } from 'redux-actions'
import { FETCH_ALL_VALIDATORS } from './../actions/index'

export const VALIDATOR_REDUCER_ID = 'validator'

export type ValidatorType = {
  name: string
  operatorAddress: string
  picture?: string
  votingPower: { number: string; percentage: string }
}

export type ValidatorStateType = {
  allValidators: ValidatorType[]
}

const initialState = {
  allValidators: [],
}

type ValidatorPayloadType = ValidatorStateType | ValidatorType[]

const validatorReducer = handleActions<ValidatorStateType, ValidatorPayloadType>(
  {
    [FETCH_ALL_VALIDATORS]: (state, action: Action<ValidatorType[]>) => ({
      allValidators: action.payload,
    }),
  },
  initialState,
)

export default validatorReducer
