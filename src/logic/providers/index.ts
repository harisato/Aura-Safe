import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { Keplr, Key } from '@keplr-wallet/types'
import { fetchProvider, _getDefaultProvider } from 'src/logic/providers/utils'

import { getProvider } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { auth } from 'src/services'
import { JWT_TOKEN_KEY } from 'src/services/constant/common'
import { store } from 'src/store'
import { saveToStorage } from 'src/utils/storage'
import session from 'src/utils/storage/session'
import { getChainInfo, getInternalChainId, _getChainId } from '../../config'
import { LAST_USED_PROVIDER_KEY } from '../wallets/store/middlewares/providerWatcher'
import { ProviderProps } from '../wallets/store/model/provider'
import { KeplrErrors } from './constants/constant'

export async function connectProvider(providerName: WALLETS_NAME): Promise<any> {
  const chainId = _getChainId()

  return getProvider()
    .then((keplr) => {
      if (!keplr) {
        alert('Please install keplr extension')
        throw new Error(KeplrErrors.NotInstall)
      }
      // let error = KeplrErrors.Success

      return keplr
    })
    .then((keplr) => Promise.all([keplr, keplr.getKey(chainId)]))
    .then(([keplr, key]) => {
      const internalChainId = getInternalChainId()
      const chainInfo = getChainInfo()

      let _providerInfo: ProviderProps
      if (!key) {
        store.dispatch(fetchProvider(_getDefaultProvider(internalChainId)))
      } else {
        _providerInfo = {
          account: key.bech32Address,
          available: true,
          hardwareWallet: false,
          loaded: true,
          name: providerName,
          network: chainInfo.chainId,
          smartContractWallet: false,
          internalChainId,
        }

        const tokenList = session.getItem<
          {
            name: string
            address: string
            token: string
          }[]
        >(JWT_TOKEN_KEY)

        const current = tokenList?.find((e) => e.address === key.bech32Address && e.name === chainId)

        if (current) {
          store.dispatch(fetchProvider(_providerInfo))

          saveToStorage(LAST_USED_PROVIDER_KEY, _providerInfo.name)
        } else {
          return handleConnectWallet(keplr, chainInfo, key, chainId, internalChainId, _providerInfo)
        }
      }
    })
    .catch((e) => {
      const message = e.message.toUpperCase()

      if (message.includes(KeplrErrors.NoChainInfo)) {
        // suggestChain()
        throw new Error(KeplrErrors.NoChainInfo)
      } else {
        const internalChainId = getInternalChainId()
        store.dispatch(fetchProvider(_getDefaultProvider(internalChainId)))
        throw new Error(KeplrErrors.Failed)
      }
    })
}

export function handleConnectWallet(
  keplr: Keplr,
  chainInfo: ChainInfo,
  key: Key,
  chainId: string,
  internalChainId: number,
  providerInfo: ProviderProps,
): any {
  const timeStamp = new Date().getTime()
  return keplr
    .signArbitrary(chainId, key.bech32Address, `${timeStamp}`)
    .then((account) =>
      auth({
        pubkey: account.pub_key.value,
        data: `${timeStamp}`,
        signature: account.signature,
        internalChainId: internalChainId,
      }),
    )
    .then((response) => {
      if (response?.Data) {
        const token: any = session.getItem(JWT_TOKEN_KEY) || []

        token.push({
          address: key.bech32Address,
          name: chainInfo.chainId,
          token: response.Data.AccessToken,
        })

        store.dispatch(fetchProvider(providerInfo))

        saveToStorage(LAST_USED_PROVIDER_KEY, providerInfo.name)

        session.setItem(JWT_TOKEN_KEY, token)
      }
    })
    .catch((e) => {
      throw new Error(e)
    })
}
