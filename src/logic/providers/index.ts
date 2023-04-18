import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { Keplr, Key } from '@keplr-wallet/types'
import { WalletKey } from 'src/logic/providers/types/providers'
import { fetchProvider, _getDefaultProvider } from 'src/logic/providers/utils'
import { getProvider, suggestChain } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { auth } from 'src/services'
import { JWT_TOKEN_KEY } from 'src/services/constant/common'
import { store } from 'src/store'
import { parseToAddress } from 'src/utils/parseByteAdress'
import { saveToStorage } from 'src/utils/storage'
import session from 'src/utils/storage/session'
import { getChainInfo, getInternalChainId, _getChainId } from '../../config'
import { LAST_USED_PROVIDER_KEY, loadLastUsedProvider } from '../wallets/store/middlewares/providerWatcher'
import { ProviderProps } from '../wallets/store/model/provider'
import { KeplrErrors } from './constants/constant'
import { getAddress } from 'src/services/index'

export async function connectProvider(providerName: WALLETS_NAME, termContext: any): Promise<any> {
  const chainId = _getChainId()

  return getProvider()
    .then((keplr) => {
      if (!keplr) {
        alert('Please install keplr extension')
        throw new Error(KeplrErrors.NotInstall)
      }

      return keplr
    })
    .then((keplr) => Promise.all([keplr, suggestChain(keplr, chainId)]))
    .then(([keplr]) => Promise.all([keplr, keplr.enable(chainId)]))
    .then(([keplr]) => Promise.all([keplr, keplr.getKey(chainId)]))
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
          getAddress(key.bech32Address)
            .then((res) => {
              if (res.ErrorCode === 'SUCCESSFUL') {
                return handleConnectWallet(keplr, chainInfo, key, chainId, internalChainId, _providerInfo)
              }
              if (res.ErrorCode !== 'SUCCESSFUL') {
                termContext.SetTerm(true)
                termContext.SetValueTerm({ keplr, chainInfo, key, chainId, internalChainId, _providerInfo })
              }
            })
            .catch((err) => {})
        }
      }
    })
    .catch((e) => {
      console.log(e)
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
  const msg = `Welcome to Pyxis Safe!

This message is only to authenticate yourself. Please sign to proceed with using Pyxis Safe.

Signing this message will not trigger a blockchain transaction or cost any gas fees.

To ensure your security, your authentication status will reset after you close the browser.

Wallet address:
${key.bech32Address}

Timestamp:
${timeStamp}`

  return keplr
    .signArbitrary(chainId, key.bech32Address, msg)
    .then((account) =>
      auth({
        pubkey: account.pub_key.value,
        data: Buffer.from(msg, 'binary').toString('base64'),
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
      return response
    })
    .catch((e) => {
      throw new Error(e)
    })
}

export async function getKeplrKey(chainId: string): Promise<WalletKey | undefined> {
  return loadLastUsedProvider()
    .then((loadLastUsedProvider) => getProvider((loadLastUsedProvider as WALLETS_NAME) || WALLETS_NAME.Keplr))
    .then((keplr) => {
      if (keplr) {
        return keplr.getKey(chainId)
      } else {
        alert("keplr not found")
      }
    })
    .then((key) =>
      key
        ? {
            myAddress: String(key.bech32Address),
            myPubkey: parseToAddress(key.pubKey),
          }
        : undefined,
    )
}
