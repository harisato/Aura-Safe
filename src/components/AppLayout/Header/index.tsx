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
import { WALLETS_CHAIN_ID, WALLETS_NAME } from '../../../logic/wallets/constant/wallets'

const HeaderComponent = ({ openConnectWallet }: { openConnectWallet: () => void }): React.ReactElement => {
  const [toggleConnect, setToggleConnect] = useState<boolean>(false)
  const [lastUsedProvider, setLastUsedProvider] = useState('')

  const [disconnected, setDisconnected] = useState(false)

  const provider = useSelector(providerNameSelector)
  const chainId = useSelector(currentChainId)
  const userAddress = useSelector(userAccountSelector)
  const loaded = useSelector(loadedSelector)
  const available = useSelector(availableSelector)
  const dispatch = useDispatch()
  const { status, connect, wallets, disconnect } = useWallet()

  useEffect(() => {
    const tryToConnectToLastUsedProvider = async () => {
      const lastUsedProvider = await loadLastUsedProvider()

      if (lastUsedProvider) {
        setLastUsedProvider(lastUsedProvider)
      }

      const canRetry = chainId === WALLETS_CHAIN_ID.TERRA_TESTNET && lastUsedProvider === WALLETS_NAME.TerraStation

      if (canRetry) {
        try {
          if (status === WalletStatus.WALLET_CONNECTED) {
            setDisconnected(true)
          }

          if (status === WalletStatus.INITIALIZING || disconnected) {
            return
          }

          if (status === WalletStatus.WALLET_NOT_CONNECTED) {
            connect(ConnectType.EXTENSION, 'station')
          }

          if (wallets && wallets[0]) {
            const chainInfo = await getChainInfo()

            const internalChainId = getInternalChainId()

            const providerInfo = {
              account: wallets[0].terraAddress,
              available: true,
              hardwareWallet: false,
              loaded: true,
              name: WALLETS_NAME.TerraStation,
              network: chainInfo.chainId,
              smartContractWallet: false,
              internalChainId,
            }

            fetchTerraStation(providerInfo)

            saveToStorage(LAST_USED_PROVIDER_KEY, providerInfo.name)
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    tryToConnectToLastUsedProvider()
  }, [chainId, status, wallets])

  useEffect(() => {
    const tryToConnectToLastUsedProvider = async () => {
      const lastUsedProvider = await loadLastUsedProvider()

      if (lastUsedProvider === WALLETS_NAME.Keplr) {
        setLastUsedProvider(lastUsedProvider)
        const connected = await connectKeplr()

        if (connected) {
          window.addEventListener('keplr_keystorechange', (event) => {
            connectKeplr()
          })
        }
      }
    }

    tryToConnectToLastUsedProvider()

    return () => {
      window.removeEventListener('keplr_keystorechange', (_) => {})
    }
  }, [chainId])

  const openDashboard = () => {
    return false
  }

  const onDisconnect = () => {
    dispatch(removeProvider())

    setDisconnected(true)

    if (lastUsedProvider === WALLETS_NAME.TerraStation && status === WalletStatus.WALLET_CONNECTED) {
      disconnect()
    }
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
