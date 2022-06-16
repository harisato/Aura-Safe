import { ReactElement, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ButtonLink } from '@gnosis.pm/safe-react-components'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { ChainId } from 'src/config/chain.d'
import { setChainId } from 'src/logic/config/utils'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import Paragraph from 'src/components/layout/Paragraph'
import { providerNameSelector, shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import ConnectButton from 'src/components/ConnectButton'
import WalletSwitch from 'src/components/WalletSwitch'
import { getChains } from 'src/config/cache/chains'
import { Container, SwitchNetworkContainer, StyledDialogTitle, StyledDialogContent, NetworkLabelItem } from './styles'
export const selectWalletAndNetworkStepLabel = 'Connect wallet & select network'

function SelectWalletAndNetworkStep(): ReactElement {
  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)
  const isWalletConnected = !!useSelector(providerNameSelector)
  const isWrongNetwork = useSelector(shouldSwitchWalletChain)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const onNetworkSwitch = useCallback((chainId: ChainId) => {
    setChainId(chainId)
    setIsNetworkSelectorPopupOpen(false)
  }, [])

  return (
    <Container data-testid={'select-network-step'}>
      {isWalletConnected ? (
        <Paragraph color="white" noMargin size="lg">
          Select network on which to create your Safe. The app is currently pointing to{' '}
          <NetworkLabel onClick={openNetworkSelectorPopup} />
        </Paragraph>
      ) : (
        <Paragraph color="white" noMargin size="lg">
          In order to select the network to create your Safe, you need to connect a wallet
        </Paragraph>
      )}

      <SwitchNetworkContainer>
        {isWalletConnected ? (
          <ButtonLink
            type="button"
            onClick={openNetworkSelectorPopup}
            color="primary"
            data-testid={'switch-network-link'}
          >
            Switch Network
          </ButtonLink>
        ) : (
          <ConnectButton onConnect={() => console.log} data-testid="heading-connect-btn" />
        )}
      </SwitchNetworkContainer>

      {isWalletConnected && isWrongNetwork && (
        <Paragraph color="primary" size="lg">
          Your wallet connection must match the selected network. <WalletSwitch />
        </Paragraph>
      )}

      <Dialog
        onClose={() => setIsNetworkSelectorPopupOpen(false)}
        aria-labelledby="select-network"
        data-testid={'select-network-popup'}
        open={isNetworkSelectorPopupOpen}
      >
        <StyledDialogTitle disableTypography>
          <Typography variant={'h5'}>Select Network</Typography>
          <IconButton aria-label="close" onClick={() => setIsNetworkSelectorPopupOpen(false)}>
            <CloseIcon />
          </IconButton>
        </StyledDialogTitle>
        <StyledDialogContent dividers>
          <List component="div">
            {getChains().map((network) => (
              <NetworkLabelItem key={network.chainId} role="button" onClick={() => onNetworkSwitch(network.chainId)}>
                <NetworkLabel networkInfo={network} flexGrow />
              </NetworkLabelItem>
            ))}
          </List>
        </StyledDialogContent>
      </Dialog>
    </Container>
  )
}

export default SelectWalletAndNetworkStep
