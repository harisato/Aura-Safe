import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import useKeplrKeyStoreChange from 'src/logic/keplr/useKeplrKeyStoreChange'
import { connectProvider } from 'src/logic/providers'
import { removeProvider } from 'src/logic/wallets/store/actions'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import {
  availableSelector,
  loadedSelector,
  providerNameSelector,
  userAccountSelector,
} from 'src/logic/wallets/store/selectors'
import { JWT_TOKEN_KEY } from 'src/services/constant/common'
import session from 'src/utils/storage/session'
import { WALLETS_NAME } from '../../../logic/wallets/constant/wallets'
import Layout from './components/Layout/Layout'
import ConnectDetails from './components/ProviderDetails/ConnectDetails/ConnectDetails'
import { UserDetails } from './components/ProviderDetails/UserDetails/UserDetails'
import ProviderAccessible from './components/ProviderInfo/ProviderAccessible/ProviderAccessible'
import ProviderDisconnected from './components/ProviderInfo/ProviderDisconnected/ProviderDisconnected'

const HeaderComponent = ({
  openConnectWallet,
  onToggleSafeList,
}: {
  openConnectWallet: () => void
  onToggleSafeList: () => void
}): React.ReactElement => {
  const [toggleConnect, setToggleConnect] = useState<boolean>(false)
  // const [lastUsedProvider, setLastUsedProvider] = useState('')

  // const [disconnected, setDisconnected] = useState(false)

  const provider = useSelector(providerNameSelector)
  const chainId = useSelector(currentChainId)
  const userAddress = useSelector(userAccountSelector)
  const loaded = useSelector(loadedSelector)
  const available = useSelector(availableSelector)
  const dispatch = useDispatch()

  useKeplrKeyStoreChange()

  useEffect(() => {
    loadLastUsedProvider().then((lastUsedProvider) => {
      // if (lastUsedProvider === WALLETS_NAME.Keplr) {
      //   // setLastUsedProvider(lastUsedProvider)
      //   connectKeplr()
      // }

      lastUsedProvider &&
        connectProvider(lastUsedProvider as WALLETS_NAME).catch((e) => {
          console.log(e)
        })
    })
  }, [chainId])

  const openDashboard = () => {
    return false
  }

  const onDisconnect = () => {
    dispatch(removeProvider())
    session.removeItem(JWT_TOKEN_KEY)
    // setDisconnected(true)
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

  return (
    <Layout
      openConnectWallet={openConnectWallet}
      providerDetails={details}
      providerInfo={info}
      showConnect={toggleConnect}
      onToggleSafeList={onToggleSafeList}
    />
  )
}

export default HeaderComponent
