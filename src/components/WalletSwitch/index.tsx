import { ReactElement, useCallback } from 'react'
import { Button, makeStyles } from '@material-ui/core'
import { Text } from '@gnosis.pm/safe-react-components'
import { switchWalletChain } from 'src/logic/wallets/utils/network'
import ChainIndicator from 'src/components/ChainIndicator'
import { connect, useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import { connectKeplr, KeplrErrors, suggestChain } from 'src/logic/keplr/keplr'
import { store } from 'src/store'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import { WalletStatus, ConnectType, useWallet } from '@terra-money/wallet-provider'
import { getChainInfo, getInternalChainId } from '../../config'
import { fetchTerraStation } from '../../logic/terraStation'
import { WALLETS_CHAIN_ID, WALLETS_NAME } from '../../logic/wallets/constant/wallets'
import { loadLastUsedProvider, LAST_USED_PROVIDER_KEY } from '../../logic/wallets/store/middlewares/providerWatcher'
import { saveToStorage } from '../../utils/storage'
import { styles } from './styles'

const useStyles = makeStyles(styles)
const WalletSwitch = (): ReactElement => {
  const classes = useStyles()
  const chainId = useSelector(currentChainId)
  const { status, connect, wallets, disconnect } = useWallet()
  const keplrConnect = useCallback(async () => {
    await connectKeplr()
      .then(async (status) => {
        if (status === KeplrErrors.NoChainInfo) {
          await suggestChain(chainId)
          return true
        }

        return null
      })
      .then((result) => {
        if (result) {
          connectKeplr()
        }
      })
      .catch(() => {
        store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
      })
  }, [])

  const terraStationConnect = useCallback(async () => {
    console.log({
      status,
      wallets,
    })
    try {
      if (status === WalletStatus.INITIALIZING) {
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
  }, [])

  const switchWalletChainAlert = async () => {
    const lastUsedProvider = await loadLastUsedProvider()

    console.log('lastUsedProvider', { lastUsedProvider, chainId })

    if (lastUsedProvider === WALLETS_NAME.TerraStation && chainId === WALLETS_CHAIN_ID.TERRA_TESTNET) {
      terraStationConnect()
    } else {
      keplrConnect()
    }
  }

  return (
    // <span className={classes.border}>
    <Button size="medium" onClick={switchWalletChainAlert} color="primary" variant="outlined">
      <Text size="lg" color="white">
        Switch wallet to <ChainIndicator chainId={chainId} />
      </Text>
    </Button>
    // </span>
  )
}

export default WalletSwitch
