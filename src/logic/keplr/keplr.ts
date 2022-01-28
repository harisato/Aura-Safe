import { store } from 'src/store'
import { Keplr, Key } from "@keplr-wallet/types";
import { getChainInfo, getInternalChainId, _getChainId } from "../../config";
import { makeProvider, ProviderProps } from '../wallets/store/model/provider';
import { Dispatch } from 'redux';
import { addProvider, removeProvider } from '../wallets/store/actions';
import enqueueSnackbar from '../notifications/store/actions/enqueueSnackbar';
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../notifications';
import { trackAnalyticsEvent, WALLET_EVENTS } from '../../utils/googleAnalytics';
import { saveToStorage } from 'src/utils/storage';
import { LAST_USED_PROVIDER_KEY } from '../wallets/store/middlewares/providerWatcher';

export async function getKeplr(): Promise<Keplr | undefined> {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }


  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
}


export async function connectKeplr(): Promise<boolean> {
  const chainInfo = await getChainInfo()
  const internalChainId = getInternalChainId()
  const chainId = _getChainId()

  const keplr = await getKeplr()
  if (!keplr) {
    alert("Please install keplr extension");
    return false;
  }


  await keplr
    ?.enable(chainId)
    .then((e) => {
      console.log('Event 1', e)
      return keplr.getKey(chainId)
    })
    .then((key) => {
      console.log('Event 2', { key })
      let providerInfo: ProviderProps;

      if (!key) {
        providerInfo = {
          account: '',
          available: false,
          hardwareWallet: false,
          loaded: false,
          name: '',
          network: '',
          smartContractWallet: false,
          internalChainId
        }
      } else {
        providerInfo = {
          account: key.bech32Address,
          available: true,
          hardwareWallet: false,
          loaded: true,
          name: 'Keplr',
          network: chainInfo.chainId,
          smartContractWallet: false,
          internalChainId
        }

        store.dispatch(fetchProvider(providerInfo))
        saveToStorage(LAST_USED_PROVIDER_KEY, providerInfo.name)
      }

    })
    .catch((err) => {
      console.log('Keplr Errors', err)
      store.dispatch(fetchProvider({
        account: '',
        available: false,
        hardwareWallet: false,
        loaded: false,
        name: '',
        network: '',
        smartContractWallet: false,
        internalChainId
      }))
      return false
    })

  return true
}

const processProviderResponse = (dispatch: Dispatch, provider: ProviderProps): void => {
  const walletRecord = makeProvider(provider)
  console.log(addProvider(walletRecord))
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

function fetchProvider(providerInfo: ProviderProps): (dispatch: Dispatch<any>) => Promise<void> {
  return async (dispatch: Dispatch<any>) => {
    handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
}