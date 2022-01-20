import { store } from 'src/store'
import { Keplr, Key } from "@keplr-wallet/types";
import { getChainInfo, _getChainId } from "../../config";
import { makeProvider, ProviderProps } from '../wallets/store/model/provider';
import { Dispatch } from 'redux';
import { addProvider } from '../wallets/store/actions';
import enqueueSnackbar from '../notifications/store/actions/enqueueSnackbar';
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../notifications';
import { trackAnalyticsEvent, WALLET_EVENTS } from '../../utils/googleAnalytics';

export async function getKeplr(): Promise<Keplr | undefined> {
  if (window.keplr) {
    return window.keplr;
  }

  alert("Please install keplr extension");

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


export async function connectKeplr(): Promise<void> {
  const chainInfo = await getChainInfo()
  const chainId = _getChainId()

  const keplr = await getKeplr()
  await keplr
    ?.enable(chainId)
    .then(() => {
      return keplr.getKey(chainId)
    })
    .then((key) => {
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
      console.error('Can not connect', err)
    })


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

function fetchProvider(providerInfo: ProviderProps): (dispatch: Dispatch<any>) => Promise<void> {
  return async (dispatch: Dispatch<any>) => {
    handleProviderNotification(providerInfo, dispatch)
    processProviderResponse(dispatch, providerInfo)
  }
}