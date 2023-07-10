import { CURRENCY_REDUCER_ID } from 'src/logic/currencyValues/store/reducer/currencyValues'
import { AppReduxState } from 'src/logic/safe/store'

export const currentCurrencySelector = (state: AppReduxState): string => {
  return state[CURRENCY_REDUCER_ID].selectedCurrency
}

export const availableCurrenciesSelector = (state: AppReduxState): string[] => {
  return state[CURRENCY_REDUCER_ID].availableCurrencies
}
