import { ReactElement } from 'react'
import { Button } from '@material-ui/core'
import { Text } from '@gnosis.pm/safe-react-components'
import { switchWalletChain } from 'src/logic/wallets/utils/network'
import ChainIndicator from 'src/components/ChainIndicator'
import { useSelector } from 'react-redux'
import { currentChainId } from 'src/logic/config/store/selectors'
import { connectKeplr, KeplrErrors, suggestChain } from 'src/logic/keplr/keplr'
import { store } from 'src/store'
import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'

const WalletSwitch = (): ReactElement => {
  const chainId = useSelector(currentChainId)

  const switchWalletChainAlert = () => {
    const keplrConect = async () => {
      await connectKeplr()
        .then((status) => {
          console.error('status', status)
          if (status === KeplrErrors.NoChainInfo) {
            return suggestChain(chainId)
          }

          return null
        })
        .then((e) => {
          if (e) {
            connectKeplr()
          }
        })
        .catch((error) => {
          store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
        })
    }

    keplrConect()
  }
  return (
    <Button variant="outlined" size="medium" color="primary" onClick={switchWalletChainAlert}>
      <Text size="lg">
        Switch wallet to <ChainIndicator chainId={chainId} />
      </Text>
    </Button>
  )
}

export default WalletSwitch
