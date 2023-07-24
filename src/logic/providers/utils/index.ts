import { Dispatch } from 'redux'

import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { addProvider } from 'src/logic/wallets/store/actions'
import { trackAnalyticsEvent, WALLET_EVENTS } from 'src/utils/googleAnalytics'
import { makeProvider, ProviderProps } from '../../wallets/store/model/provider'

function processProviderResponse(dispatch: Dispatch, provider: ProviderProps): void {
  const walletRecord = makeProvider(provider)
  dispatch(addProvider(walletRecord))
}

export function fetchProvider(providerInfo: ProviderProps): (dispatch: Dispatch<any>) => Promise<void> {
  return async (dispatch: Dispatch<any>) => {
    handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
}

function handleProviderNotification(provider: ProviderProps, dispatch: Dispatch<any>): void {
  const { available, loaded } = provider

  if (!loaded) {
    console.error(`Provider not loaded`)
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

export function _getDefaultProvider(internalChainId: number): ProviderProps {
  return {
    account: '',
    available: false,
    hardwareWallet: false,
    loaded: false,
    name: '',
    network: '',
    smartContractWallet: false,
    internalChainId,
  }
}
