import BigNumber from 'bignumber.js'
import { Dispatch } from 'redux'

import { SafeBalanceResponse } from '@gnosis.pm/safe-react-gateway-sdk'
import { getChains } from 'src/config/cache/chains'
import { currentCurrencySelector } from 'src/logic/currencyValues/store/selectors'
import { Errors, logError } from 'src/logic/exceptions/CodedException'
import { TokenBalance, fetchTokenCurrenciesBalances } from 'src/logic/safe/api/fetchTokenCurrenciesBalances'
import { AppReduxState } from 'src/logic/safe/store'
import { updateSafe } from 'src/logic/safe/store/actions/updateSafe'
import { currentSafe } from 'src/logic/safe/store/selectors'
import { addTokens } from 'src/logic/tokens/store/actions/addTokens'
import { Token, makeToken } from 'src/logic/tokens/store/model/token'
import { humanReadableValue } from 'src/logic/tokens/utils/humanReadableValue'
import { ZERO_ADDRESS, sameAddress } from 'src/logic/wallets/ethAddresses'
import { IMSafeInfo } from 'src/types/safe'
import axios from 'axios'
import { getTokenDetail } from 'src/services'

export type BalanceRecord = {
  tokenAddress?: string
  tokenBalance: string
  fiatBalance?: string
}

interface ExtractedData {
  balances: Array<BalanceRecord>
  nativeBalance: string
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
    acc.nativeBalance = humanReadableValue(balance, Number(decimals))
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

    const { balances, nativeBalance, tokens } = tokenCurrenciesBalances.items.reduce<ExtractedData>(
      extractDataFromResult,
      {
        balances: [],
        nativeBalance: '0',
        tokens: [],
      },
    )

    dispatch(
      updateSafe({
        address: safeAddress,
        balances,
        nativeBalance: '0',
        totalFiatBalance: new BigNumber(tokenCurrenciesBalances.fiatTotal).toFixed(6),
      }),
    )
    dispatch(addTokens(tokens))
  }
export const fetchMSafeTokens =
  (safeInfo: IMSafeInfo) =>
  async (dispatch: Dispatch): Promise<void> => {
    if (safeInfo) {
      if (safeInfo?.balance) {
        const listChain = getChains()
        const tokenDetailsListData = await getTokenDetail()
        const tokenDetailsList = await tokenDetailsListData.json()
        const chainInfo: any = listChain.find((x: any) => x.internalChainId === safeInfo?.internalChainId)
        const nativeTokenData = safeInfo.balance.find((balance) => balance.denom == chainInfo.denom)
        const balances: any[] = []
        if (nativeTokenData) {
          balances.push({
            tokenBalance: `${humanReadableValue(
              +nativeTokenData?.amount > 0 ? nativeTokenData?.amount : 0,
              chainInfo.nativeCurrency.decimals,
            )}`,
            tokenAddress: '0000000000000000000000000000000000000000',
            decimals: chainInfo.nativeCurrency.decimals,
            logoUri: chainInfo.nativeCurrency.logoUri,
            name: chainInfo.nativeCurrency.name,
            symbol: chainInfo.nativeCurrency.symbol,
            denom: chainInfo.denom,
            type: 'native',
          })
        }
        safeInfo.balance
          .filter((balance) => balance.denom != chainInfo.denom)
          .forEach((data: any) => {
            balances.push({
              tokenBalance: `${humanReadableValue(+data?.amount > 0 ? data?.amount : 0, data.decimal)}`,
              tokenAddress: '111111111111111111111111111111111111111',
              decimals: data.decimal,
              logoUri: data.logo,
              name: data.display,
              symbol: data.display,
              denom: data.denom,
              type: 'ibc',
            })
          })

        if (safeInfo.assets.CW20.asset.length > 0) {
          safeInfo.assets.CW20.asset.forEach((data) => {
            const tokenDetail = tokenDetailsList.find((token) => token.address == data.contract_address)
            balances.push({
              tokenBalance: `${humanReadableValue(
                +data?.balance > 0 ? data?.balance : 0,
                data.asset_info.data.decimals,
              )}`,
              tokenAddress: data.contract_address,
              decimals: data.asset_info.data.decimals,
              name: tokenDetail?.name,
              logoUri: tokenDetail?.icon
                ? `https://aura-nw.github.io/token-registry/images/${tokenDetail?.icon}`
                : 'https://aura-nw.github.io/token-registry/images/undefined.png',
              symbol: data.asset_info.data.symbol,
              denom: data.asset_info.data.symbol,
              type: 'CW20',
            })
          })
        }
        const nativeBalance = humanReadableValue(
          nativeTokenData?.amount ? nativeTokenData?.amount : '0',
          chainInfo.nativeCurrency.decimals,
        )
        dispatch(
          updateSafe({
            address: safeInfo.address,
            balances,
            nativeBalance,
          }),
        )
      }
    }
  }
