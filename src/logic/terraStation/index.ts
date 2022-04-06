import { store } from 'src/store'
import { trackAnalyticsEvent, WALLET_EVENTS } from '../../utils/googleAnalytics'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../notifications'
import enqueueSnackbar from '../notifications/store/actions/enqueueSnackbar'
import { addProvider } from '../wallets/store/actions'
import { makeProvider, ProviderProps } from '../wallets/store/model/provider'
import { Dispatch } from 'redux'

export function fetchTerraStation(providerInfo: ProviderProps) {
  store.dispatch(fetchProvider(providerInfo))
}

const processProviderResponse = (dispatch: Dispatch, provider: ProviderProps): void => {
  const walletRecord = makeProvider(provider)
  dispatch(addProvider(walletRecord))
}

function fetchProvider(providerInfo: ProviderProps): (dispatch: Dispatch<any>) => Promise<void> {
  return async (dispatch: Dispatch<any>) => {
    handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
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
