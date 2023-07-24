import { Action, handleActions } from 'redux-actions'
import { IFund } from 'src/components/JsonschemaForm/FundForm'
import { ADD_TO_FUNDS } from '../actions'

export const FUNDS_REDUCER_ID = 'funds'

export type FundStateType = {
  funds: IFund[]
}

const initialState = {
  funds: [],
}

type FundPayloadType = FundStateType | IFund[]

const delegationReducer = handleActions<FundStateType, FundPayloadType>(
  {
    [ADD_TO_FUNDS]: (state, action: Action<IFund[]>) => ({
      funds: action.payload,
    }),
  },
  initialState,
)

export default delegationReducer
