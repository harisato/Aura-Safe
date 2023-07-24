import * as Sentry from '@sentry/react'
import { List } from 'immutable'
import { createSelector } from 'reselect'

import { Token } from 'src/logic/tokens/store/model/token'
import { tokensSelector } from 'src/logic/tokens/store/selectors'
import { getEthAsToken } from 'src/logic/tokens/utils/tokenHelpers'
import { isUserAnOwner } from 'src/logic/wallets/ethAddresses'
import { shouldSwitchWalletChain, userAccountSelector } from 'src/logic/wallets/store/selectors'

import { SafeRecord } from 'src/logic/safe/store/models/safe'
import { currentSafe, currentSafeBalances } from 'src/logic/safe/store/selectors'

export const grantedSelector = createSelector(
  userAccountSelector,
  currentSafe,
  shouldSwitchWalletChain,
  (userAccount: string, safe: SafeRecord, isWrongChain: boolean): boolean => {
    return isUserAnOwner(safe, userAccount) && !isWrongChain
  },
)

const safeEthAsTokenSelector = createSelector(currentSafe, (safe?: SafeRecord): Token | undefined => {
  if (!safe) {
    return undefined
  }

  return getEthAsToken(safe.nativeBalance)
})

export const extendedSafeTokensSelector = createSelector(
  currentSafeBalances,
  tokensSelector,
  safeEthAsTokenSelector,
  (safeBalances, tokensList, ethAsToken): List<Token> => {
    const extendedTokens: Array<Token> = []
    if (!Array.isArray(safeBalances)) {
      Sentry.captureMessage(
        'There was an error loading `safeBalances` in `extendedSafeTokensSelector`, probably safe loaded prior to v3.5.0',
      )
      return List([])
    }
    safeBalances.forEach((safeBalance: any) => {
      extendedTokens.push({
        address: safeBalance.tokenAddress || '000',
        balance: {
          tokenBalance: safeBalance.tokenBalance,
        },
        decimals: safeBalance.decimals,
        name: safeBalance.name,
        symbol: safeBalance.symbol,
        logoUri: safeBalance.logoUri,
        type: safeBalance.type,
        denom: safeBalance.denom,
        cosmosDenom: safeBalance.cosmosDenom,
      } as Token)
    })

    return List(extendedTokens)
  },
)

export const safeKnownCoins = createSelector(
  tokensSelector,
  safeEthAsTokenSelector,
  (safeTokens, nativeCurrencyAsToken): List<Token> => {
    if (nativeCurrencyAsToken) {
      return safeTokens.set(nativeCurrencyAsToken.address, nativeCurrencyAsToken).toList()
    }

    return safeTokens.toList()
  },
)
