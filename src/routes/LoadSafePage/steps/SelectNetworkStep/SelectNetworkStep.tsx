import { ReactElement, useState } from 'react'
import { ButtonLink } from '@aura/safe-react-components'
import Dialog from '@material-ui/core/Dialog'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
import { ChainId } from 'src/config/chain.d'
import { setChainId } from 'src/logic/config/utils'
import Paragraph from 'src/components/layout/Paragraph'
import NetworkLabel from 'src/components/NetworkLabel/NetworkLabel'
import { getChains } from 'src/config/cache/chains'
import {
  Container,
  StyledDialogContent,
  StyledDialogTitle,
  NetworkLabelItem,
  SwitchNetworkContainer,
  StyledLink,
} from './styles'

export const selectNetworkStepLabel = 'Select network'

function SelectNetworkStep(): ReactElement {
  const [isNetworkSelectorPopupOpen, setIsNetworkSelectorPopupOpen] = useState(false)

  function openNetworkSelectorPopup() {
    setIsNetworkSelectorPopupOpen(true)
  }

  const onNetworkSwitch = (chainId: ChainId) => {
    setChainId(chainId)
    setIsNetworkSelectorPopupOpen(false)
  }

  return (
    <Container data-testid={'select-network-step'}>
      <Paragraph color="primary" noMargin size="lg">
        Select network on which the Safe was created: <NetworkLabel onClick={openNetworkSelectorPopup} />
      </Paragraph>
      <SwitchNetworkContainer>
        <StyledLink color="linkAura" type="button" onClick={openNetworkSelectorPopup}>
          Switch Network
        </StyledLink>
      </SwitchNetworkContainer>
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

export default SelectNetworkStep
