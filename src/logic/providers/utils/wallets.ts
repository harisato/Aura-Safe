import { Keplr } from '@keplr-wallet/types'
import _ from 'lodash'
import { KeplrErrors } from 'src/logic/providers/constants/constant'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { getGatewayUrl } from 'src/services/data/environment'

export async function suggestChain(keplr: Keplr, chainId = 'aura-testnet'): Promise<any> {
  return getGatewayUrl().then((res: any) => {
    const chainInfo = _.find(res.chainInfo, ['chainId', chainId])
    if (chainInfo) {
      return keplr.experimentalSuggestChain(chainInfo)
    } else {
      const result = confirm(`Please add the ${chainId} chain to your Wallet!`)

      if (result) {
        window.open(
          'https://github.com/aura-nw/Aura-Safe/blob/dev/CONNECT_KEPLR.md#i-connect-keplr-wallet-to-aura-testnet',
        )
      }

      throw new Error(KeplrErrors.NoChainInfo)
    }
  })
}

export async function getProvider(providerName?: WALLETS_NAME): Promise<Keplr | undefined | null> {
  if (providerName === WALLETS_NAME.Coin98) {
    return checkExistedCoin98()
  }

  if ((window as any).keplr) {
    return (window as any).keplr
  }

  if (document.readyState === 'complete') {
    return (window as any).keplr
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        resolve((window as any).keplr)
        document.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document.addEventListener('readystatechange', documentStateChange)
  })
}

export function checkExistedCoin98(): Keplr | null | undefined {
  if ((window as any).coin98) {
    if ((window as any).coin98.keplr) {
      return (window as any).keplr || (window as any).coin98.keplr
    } else {
      return undefined // c98 not override keplr
    }
  }

  return null // not found coin98
}
