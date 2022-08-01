import { store } from 'src/store'
import { Keplr } from '@keplr-wallet/types'
import { getChainInfo, getInternalChainId, _getChainId } from '../../config'
import { makeProvider, ProviderProps } from '../wallets/store/model/provider'
import { Dispatch } from 'redux'
import { addProvider, removeProvider } from '../wallets/store/actions'
import enqueueSnackbar from '../notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../notifications'
import { trackAnalyticsEvent, WALLET_EVENTS } from '../../utils/googleAnalytics'
import { saveToStorage } from 'src/utils/storage'
import { LAST_USED_PROVIDER_KEY } from '../wallets/store/middlewares/providerWatcher'
import { parseToAdress } from 'src/utils/parseByteAdress'
import * as _ from 'lodash'
import { WALLETS_NAME } from '../wallets/constant/wallets'
import { auth } from 'src/services/index'
import { getGatewayUrl } from 'src/services/data/environment'
import { JWT_TOKEN_KEY, NAME_KEPLR } from 'src/services/constant/common'
import local from 'src/utils/storage/local'

export type WalletKey = {
  myAddress: string
  myPubkey: string
}

export enum KeplrErrors {
  Success = 'OK',
  Failed = 'FAILED',
  NoChainInfo = 'THERE IS NO CHAIN INFO FOR',
  SameChain = 'SAME CHAIN IS ALREADY REGISTERED',
  NotRegistered = 'CHAIN IS NOT REGISTERED',
  RequestRejected = 'REQUEST REJECTED',
  NotInstall = 'NOT INSTALL',
}

export async function getKeplr(): Promise<Keplr | undefined> {
  if (window.keplr) {
    return window.keplr
  }

  if (document.readyState === 'complete') {
    return window.keplr
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (event.target && (event.target as Document).readyState === 'complete') {
        resolve(window.keplr)
        document.removeEventListener('readystatechange', documentStateChange)
      }
    }

    document.addEventListener('readystatechange', documentStateChange)
  })
}

export async function getKeplrKey(chainId: string): Promise<WalletKey | undefined> {
  const keplr = await getKeplr()

  if (!keplr) return
  const key = await keplr.getKey(chainId)
  return {
    myAddress: String(key.bech32Address),
    myPubkey: parseToAdress(key.pubKey),
  }
}

export const handleConnectWallet = (keplr, chainInfo, key, chainId, internalChainId, providerInfo) => {
  const arrayTemp: any = JSON.parse(local.getItem(JWT_TOKEN_KEY) || '[]')

  if (window.keplr && !_.find(arrayTemp, ['name', chainInfo.chainId])) {
    const timeStamp = new Date().getTime()
    keplr
      ?.signArbitrary(chainId, key.bech32Address, `${timeStamp}`)
      .then(
        (account) =>
          auth({
            pubkey: account.pub_key.value,
            data: `${timeStamp}`,
            signature: account.signature,
            internalChainId: internalChainId,
          }),
        // .then(async (e) => {
        //   const chain = {
        //     name: chainInfo.chainId,
        //     token: e.Data.AccessToken,
        //   }
        //   if (chain) {
        //     arrayTemp.push(chain)
        //     window.localStorage.setItem('TOKEN', JSON.stringify(arrayTemp))
        //   }
        // })
      )
      .then((response) => {
        if (response?.Data) {
          arrayTemp.push({
            name: chainInfo.chainId,
            token: response.Data.AccessToken,
          })
          local.setItem(JWT_TOKEN_KEY, arrayTemp)
        }
      })
      .catch(() => {
        store.dispatch(removeProvider({ keepStorageKey: true }))
        // store.dispatch(fetchProvider(providerInfo))
        // throw new Error('Authentication Fail')
      })
  }

  store.dispatch(removeProvider({ keepStorageKey: true }))
  store.dispatch(fetchProvider(providerInfo))
  saveToStorage(LAST_USED_PROVIDER_KEY, providerInfo.name)
}

export async function connectKeplr(): Promise<KeplrErrors> {
  const chainInfo = await getChainInfo()
  const internalChainId = getInternalChainId()
  const chainId = _getChainId()
  const keplr = await getKeplr()

  if (!keplr) {
    alert('Please install keplr extension')
    return KeplrErrors.NotInstall
  }

  let error = KeplrErrors.Success
  try {
    await keplr
      .enable(chainId)
      .then(() => keplr.getKey(chainId))
      .then((key: any) => {
        let providerInfo: ProviderProps
        if (!key) {
          providerInfo = {
            account: '',
            available: false,
            hardwareWallet: false,
            loaded: false,
            name: '',
            network: '',
            smartContractWallet: false,
            internalChainId,
          }
          store.dispatch(fetchProvider(providerInfo))
        } else {
          providerInfo = {
            account: key.bech32Address,
            available: true,
            hardwareWallet: false,
            loaded: true,
            name: WALLETS_NAME.Keplr,
            network: chainInfo.chainId,
            smartContractWallet: false,
            internalChainId,
          }
          const nameKeplr = local.getItem(NAME_KEPLR)

          if (key.name) {
            if (nameKeplr !== key.name) {
              local.removeItem(JWT_TOKEN_KEY)
              local.setItem(NAME_KEPLR, key.name)
              handleConnectWallet(keplr, chainInfo, key, chainId, internalChainId, providerInfo)
            }
            if (nameKeplr === key.name) {
              handleConnectWallet(keplr, chainInfo, key, chainId, internalChainId, providerInfo)
            }
            local.setItem(NAME_KEPLR, key.name || '')
          }
        }
      })
  } catch (e) {
    const message = e.message.toUpperCase()

    if (message.includes(KeplrErrors.NoChainInfo)) {
      // suggestChain()
      error = KeplrErrors.NoChainInfo
    } else {
      error = KeplrErrors.Failed
      store.dispatch(
        fetchProvider({
          account: '',
          available: false,
          hardwareWallet: false,
          loaded: false,
          name: '',
          network: '',
          smartContractWallet: false,
          internalChainId,
        }),
      )
    }
  }

  return error
}

const processProviderResponse = (dispatch: Dispatch, provider: ProviderProps): void => {
  const walletRecord = makeProvider(provider)
  dispatch(addProvider(walletRecord))
}

const handleProviderNotification = (provider: ProviderProps, dispatch: Dispatch<any>): void => {
  const { available, loaded } = provider

  if (!loaded) {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
    return
  }

  if (available) {
    trackAnalyticsEvent({
      ...WALLET_EVENTS.CONNECT_WALLET,
      label: provider.name,
    })
  } else {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
  }
}

export async function suggestChain(chainId = 'aura-testnet'): Promise<any> {
  return getGatewayUrl().then((res: any) => {
    const chainInfo = _.find(res.chainInfo, ['chainId', chainId])
    if (chainInfo) {
      return window['keplr']?.experimentalSuggestChain(chainInfo)
    } else {
      const result = confirm(`Please add the ${chainId} chain to your Wallet!`)

      if (result) {
        window.open(
          'https://github.com/aura-nw/Aura-Safe/blob/dev/CONNECT_KEPLR.md#i-connect-keplr-wallet-to-aura-testnet',
        )
      }

      return null
    }
  })
}

function fetchProvider(providerInfo: ProviderProps): (dispatch: Dispatch<any>) => Promise<void> {
  return async (dispatch: Dispatch<any>) => {
    handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
}
