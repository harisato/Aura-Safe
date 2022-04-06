import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Layout from './components/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails'
import { UserDetails } from './components/ProviderDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected'
import { currentChainId } from 'src/logic/config/store/selectors'
import {
  availableSelector,
  loadedSelector,
  providerNameSelector,
  userAccountSelector,
} from 'src/logic/wallets/store/selectors'
import { removeProvider } from 'src/logic/wallets/store/actions'
import { LAST_USED_PROVIDER_KEY, loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { connectKeplr } from '../../../logic/keplr/keplr'
import { ConnectType, useWallet, WalletStatus } from '@terra-money/wallet-provider'
import { fetchTerraStation } from '../../../logic/terraStation'
import { getChainInfo, getInternalChainId } from '../../../config'
import { saveToStorage } from '../../../utils/storage'

const HeaderComponent = ({ openConnectWallet }: { openConnectWallet: () => void }): React.ReactElement => {
  const [toggleConnect, setToggleConnect] = useState<boolean>(false)

  const provider = useSelector(providerNameSelector)
  const chainId = useSelector(currentChainId)
  const userAddress = useSelector(userAccountSelector)
  const loaded = useSelector(loadedSelector)
  const available = useSelector(availableSelector)
  const dispatch = useDispatch()

  const { status, connect, wallets } = useWallet()

  useEffect(() => {
    const tryToConnectToLastUsedProvider = async () => {
      const lastUsedProvider = await loadLastUsedProvider()

      if (lastUsedProvider) {
        if (lastUsedProvider === 'Keplr') {
          const connected = await connectKeplr()
          if (connected) {
            window.addEventListener(
              'keplr_keystorechange',
              (event) => {
                connectKeplr()
              },
              // { once: true },
            )
          }
        } else {
          try {
            console.log({ status, connect, wallets });
            
            if(!connect || status === WalletStatus.INITIALIZING) { return }
            connect(ConnectType.EXTENSION, 'station')

            if (status === WalletStatus.WALLET_CONNECTED) {
              const _fetchTerraStation = async () => {
                const chainInfo = await getChainInfo()
                const internalChainId = getInternalChainId()

                const providerInfo = {
                  account: wallets[0].terraAddress,
                  available: true,
                  hardwareWallet: false,
                  loaded: true,
                  name: 'Terra Station',
                  network: chainInfo.chainId,
                  smartContractWallet: false,
                  internalChainId,
                }

                fetchTerraStation(providerInfo)

                saveToStorage(LAST_USED_PROVIDER_KEY, providerInfo.name)
              }

              _fetchTerraStation()
            }
          } catch (e) {
            console.error(e)
          }
        }
      }
    }

    tryToConnectToLastUsedProvider()

    return () => {
      window.removeEventListener('keplr_keystorechange', (event) => {})
    }
  }, [chainId])

  const openDashboard = () => {
    // const { wallet } = onboard().getState()
    // return wallet.type === 'sdk' && wallet.dashboard
    return false
  }

  const onDisconnect = () => {
    dispatch(removeProvider())
  }

  const onShowConnect = () => {
    setToggleConnect(!toggleConnect)

    openConnectWallet()
  }

  const getProviderInfoBased = () => {
    if (!loaded || !provider) {
      return <ProviderDisconnected />
    }

    return <ProviderAccessible connected={available} provider={provider} userAddress={userAddress} />
  }

  const getProviderDetailsBased = () => {
    if (!loaded) {
      return <ConnectDetails connectButtonClick={onShowConnect} />
    }

    return (
      <UserDetails
        connected={available}
        onDisconnect={onDisconnect}
        openDashboard={openDashboard()}
        provider={provider}
        userAddress={userAddress}
      />
    )
  }

  const info = getProviderInfoBased()
  const details = getProviderDetailsBased()

  return <Layout providerDetails={details} providerInfo={info} showConnect={toggleConnect} />
}

export default HeaderComponent
