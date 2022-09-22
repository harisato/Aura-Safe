import { Text } from '@aura/safe-react-components'
import { Button } from '@material-ui/core'
import { ReactElement, useCallback } from 'react'
import { useSelector } from 'react-redux'
import ChainIndicator from 'src/components/ChainIndicator'
import { currentChainId } from 'src/logic/config/store/selectors'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { connectProvider } from 'src/logic/providers'
import { checkExistedCoin98 } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { store } from 'src/store'

// const useStyles = makeStyles(styles)
const WalletSwitch = ({ openConnectWallet }: { openConnectWallet?: () => void }): ReactElement => {
  // const classes = useStyles()
  const chainId = useSelector(currentChainId)

  const keplrConnect = useCallback(() => {
    loadLastUsedProvider()
      .then((lastUsedProvider) => {
        if (lastUsedProvider) {
          if (lastUsedProvider == WALLETS_NAME.Coin98 && !checkExistedCoin98()) {
            return
          }

          connectProvider(lastUsedProvider as WALLETS_NAME).catch(() => {
            store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
          })
        } else {
          openConnectWallet && openConnectWallet()
        }
      })
      .catch(() => {
        store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
      })
  }, [openConnectWallet])

  return (
    // <span className={classes.border}>
    <Button size="medium" onClick={keplrConnect} color="primary" variant="outlined">
      <Text size="lg" color="white">
        Switch wallet to <ChainIndicator chainId={chainId} />
      </Text>
    </Button>
    // </span>
  )
}

export default WalletSwitch
