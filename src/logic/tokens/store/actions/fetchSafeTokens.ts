import BigNumber from 'bignumber.js'
import { Dispatch } from 'redux'

import { SafeBalanceResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { fetchTokenCurrenciesBalances, TokenBalance } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'
import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { addTokens } from 'src/logic/tokens/store/actions/addTokens'
import { makeToken, Token } from 'src/logic/tokens/store/model/token'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { sameAddress, ZERO_ADDRESS } from 'src/logic/wallets/ethAddresses'
import { getMChainsConfig } from 'src/services/index'
import { AppReduxState } from 'src/store'
import { IMSafeInfo } from 'src/types/safe'

export type BalanceRecord = {
  tokenAddress?: string
  tokenBalance: string
  fiatBalance?: string
}

interface ExtractedData {
  balances: Array<BalanceRecord>
  ethBalance: string
  tokens: Array<Token>
}

const extractDataFromResult = (
  acc: ExtractedData,
  { balance, fiatBalance, tokenInfo }: TokenBalance,
): ExtractedData => {
  const { address, decimals } = tokenInfo
  acc.balances.push({
    tokenAddress: address,
    fiatBalance,
    tokenBalance: humanReadableValue(balance, Number(decimals)),
  })

  // Extract network token balance from backend balances
  if (sameAddress(address, ZERO_ADDRESS)) {
    acc.ethBalance = humanReadableValue(balance, Number(decimals))
  } else {
    acc.tokens.push(makeToken({ ...tokenInfo }))
  }

  return acc
}

export const fetchSafeTokens =
  (safeAddress: string, currency?: string) =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
    const state = getState()
    const safe = currentSafe(state)

    if (!safe) {
      return
    }
    const selectedCurrency = currency ?? currentCurrencySelector(state)

    let tokenCurrenciesBalances: SafeBalanceResponse
    try {
      tokenCurrenciesBalances = await fetchTokenCurrenciesBalances({
        safeAddress,
        selectedCurrency,
      })
    } catch (e) {
      logError(Errors._601, e.message)
      return
    }

    const { balances, ethBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
      extractDataFromResult,
      {
        balances: [],
        ethBalance: '0',
        tokens: [],
      },
    )

    dispatch(
      updateSafe({
        address: safeAddress,
        balances,
        ethBalance: '0',
        totalFiatBalance: new BigNumber(tokenCurrenciesBalances.fiatTotal).toFixed(6),
      }),
    )
    dispatch(addTokens(tokens))
  }
export const fetchMSafeTokens =
  (safeInfo: IMSafeInfo) =>
  async (dispatch: Dispatch, getState: () => AppReduxState): Promise<void> => {
    if (safeInfo) {
      const tokenCurrenciesBalances: SafeBalanceResponse = {
        fiatTotal: '0',
        items: [],
      }

      if (safeInfo?.balance) {
        const listChain = await getMChainsConfig()
        const decimal: any = listChain.find((x: any) => x.internalChainId === safeInfo?.internalChainId)
        safeInfo.balance.forEach((balance) => {
          console.log('balance', balance)

          tokenCurrenciesBalances.items.push({
            balance: `${+balance.amount > 0 ? balance.amount : 0}`,
            fiatBalance: '0',
            fiatConversion: '0',
            tokenInfo: {
              address: '0000000000000000000000000000000000000000',
              decimals: decimal.nativeCurrency.decimals,
              logoUri: '',
              name: 'Aura',
              symbol: decimal.nativeCurrency.coinDenom,
            },
          })
        })
      }

      const { balances, ethBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
        extractDataFromResult,
        {
          balances: [],
          ethBalance: '0',
          tokens: [],
        },
      )

      dispatch(
        updateSafe({
          address: safeInfo.address,
          balances,
          ethBalance,
          totalFiatBalance: new BigNumber(tokenCurrenciesBalances.fiatTotal).toFixed(6),
        }),
      )
      dispatch(addTokens(tokens))
    }

    /* 
      const state = getState()
      const safe = currentSafe(state)

      if (!safe) {
        return
      }
      const selectedCurrency = currency ?? currentCurrencySelector(state)

      let tokenCurrenciesBalances: SafeBalanceResponse
      try {
        tokenCurrenciesBalances = await fetchTokenCurrenciesBalances({
          safeAddress,
          selectedCurrency,
        })
      } catch (e) {
        logError(Errors._601, e.message)
        return
      }

      const { balances, ethBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
        extractDataFromResult,
        {
          balances: [],
          ethBalance: '0',
          tokens: [],
        },
      )

      dispatch(
        updateSafe({
          address: safeAddress,
          balances,
          ethBalance,
          totalFiatBalance: new BigNumber(tokenCurrenciesBalances.fiatTotal).toFixed(2),
        }),
      )
      dispatch(addTokens(tokens)) 
      */
  }
