import { Dispatch } from 'redux'
import { ReactElement } from 'react'
import Button from 'src/components/layout/Button'
import { getChainInfo, _getChainId } from 'src/config'
import { getWeb3 } from 'src/logic/wallets/getWeb3'
import onboard from 'src/logic/wallets/onboard'
import { shouldSwitchNetwork, switchNetwork } from 'src/logic/wallets/utils/network'
import { getKeplr } from '../../logic/keplr/keplr'
import { addProvider } from '../../logic/wallets/store/actions'
import { store } from 'src/store'
import { makeProvider, ProviderProps } from '../../logic/wallets/store/model/provider'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import { trackAnalyticsEvent, WALLET_EVENTS } from '../../utils/googleAnalytics'
import { parseToAdress } from '../../utils/parseByteAdress'

const checkWallet = async (): Promise<boolean> => {
  if (shouldSwitchNetwork()) {
    switchNetwork(onboard().getState().wallet, _getChainId()).catch((e) => e.log())
  }

  return await onboard().walletCheck()
}

export const onboardUser = async (): Promise<boolean> => {
  // before calling walletSelect you want to check if web3 has been instantiated
  // which indicates that a wallet has already been selected
  // and web3 has been instantiated with that provider
  const web3 = getWeb3()
  const walletSelected = web3 ? true : await onboard().walletSelect()
  return walletSelected && checkWallet()
}

export const onConnectButtonClick = async (): Promise<void> => {
  // const walletSelected = await onboard().walletSelect()

  // // perform wallet checks only if user selected a wallet
  // if (walletSelected) {
  //   await checkWallet()
  // }

  const chainInfo = await getChainInfo()
  
  console.log(chainInfo)
  const chainId = _getChainId()

  const keplr = await getKeplr()
  await keplr
    ?.enable(chainId)
    .then(() => {
      return keplr.getKey(chainId)
    })
    .then((key) => {

      console.log(key)

      const providerInfo: ProviderProps = {
        account: key.bech32Address,
        available: true,
        hardwareWallet: false,
        loaded: true,
        name: 'Keplr',
        network: chainInfo.chainId,
        smartContractWallet: false,
      }

      store.dispatch(fetchProvider(providerInfo))
    })
    .catch((err) => {
      console.log('Can not connect', err)
    })
}

const ConnectButton = (props: { 'data-testid': string }): ReactElement => (
  <Button color="primary" minWidth={240} onClick={onConnectButtonClick} variant="contained" {...props}>
    Connect
  </Button>
)

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
    // NOTE:
    // if you want to be able to dispatch a `closeSnackbar` action later on,
    // you SHOULD pass your own `key` in the options. `key` can be any sequence
    // of number or characters, but it has to be unique to a given snackbar.

    // Cannot import from useAnalytics here, so using fn directly
    trackAnalyticsEvent({
      ...WALLET_EVENTS.CONNECT_WALLET,
      label: provider.name,
    })
  } else {
    dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.UNLOCK_WALLET_MSG)))
  }
}

function fetchProvider(providerInfo: ProviderProps): (dispatch: Dispatch<any>) => Promise<void> {
  return async (dispatch: Dispatch<any>) => {
    handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
}

export default ConnectButton
