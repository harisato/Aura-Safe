import { Text } from '@aura/safe-aura-components'
import { Button, makeStyles } from '@material-ui/core'
import { ReactElement, useCallback } from 'react'
import { useSelector } from 'react-redux'
import ChainIndicator from 'src/components/ChainIndicator'
import { currentChainId } from 'src/logic/config/store/selectors'
import { connectKeplr, KeplrErrors, suggestChain } from 'src/logic/keplr/keplr'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { store } from 'src/store'
import { styles } from './styles'

const useStyles = makeStyles(styles)
const WalletSwitch = (): ReactElement => {
  const classes = useStyles()
  const chainId = useSelector(currentChainId)
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

  const switchWalletChainAlert = async () => {
    keplrConnect()
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
