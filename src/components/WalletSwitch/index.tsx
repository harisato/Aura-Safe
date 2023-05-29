import { Text } from '@aura/safe-react-components'
import { Button } from '@material-ui/core'
import { ReactElement, useCallback, useContext } from 'react'
import { useSelector } from 'react-redux'
import ChainIndicator from 'src/components/ChainIndicator'
import { currentChainId } from 'src/logic/config/store/selectors'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { connectProvider } from 'src/logic/providers'
import { checkExistedCoin98 } from 'src/logic/providers/utils/wallets'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { loadLastUsedProvider } from 'src/logic/wallets/store/middlewares/providerWatcher'
import { store } from 'src/logic/safe/store'
import TermContext from 'src/logic/TermContext'
// const useStyles = makeStyles(styles)
const WalletSwitch = ({ openConnectWallet }: { openConnectWallet?: () => void }): ReactElement => {
  // const classes = useStyles()
  const chainId = useSelector(currentChainId)
  const termContext = useContext(TermContext)

  const keplrConnect = useCallback(() => {
    loadLastUsedProvider()
      .then((lastUsedProvider) => {
        if (lastUsedProvider) {
          if (lastUsedProvider == WALLETS_NAME.Coin98 && !checkExistedCoin98()) {
            return
          }

          connectProvider(lastUsedProvider as WALLETS_NAME, termContext).catch((error) => {
            console.error('error 2', error)
            store.dispatch(
              enqueueSnackbar(
                enhanceSnackbarForAction(
                  error?.message
                    ? {
                        message: error?.message,
                        options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                      }
                    : NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG,
                ),
              ),
            )
          })
        } else {
          openConnectWallet && openConnectWallet()
        }
      })
      .catch((error) => {
        console.error('error 1', error)
        store.dispatch(
          enqueueSnackbar(
            enhanceSnackbarForAction(
              error?.message
                ? {
                    message: error?.message,
                    options: { variant: 'error', persist: false, autoHideDuration: 5000, preventDuplicate: true },
                  }
                : NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG,
            ),
          ),
        )
      })
  }, [openConnectWallet])

  return (
    // <span className={classes.border}>
    <Button size="medium" onClick={keplrConnect} color="primary" variant="outlined">
      <div style={{ marginRight: 4 }}>
        <Text size="lg" color="white">
          Switch wallet to
        </Text>
      </div>
      <div>
        <Text size="lg" color="white">
          <ChainIndicator chainId={chainId} />
        </Text>
      </div>
    </Button>
    // </span>
  )
}

export default WalletSwitch
