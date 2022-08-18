import React from 'react'
import { Modal } from 'src/components/Modal'
import { _getChainId } from '../../config'
import { connectKeplr, suggestChain } from '../../logic/keplr/keplr'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { store } from '../../store'
import Img from '../layout/Img'
import Keplr from './assets/keplr.svg'
import { ImageContainer, ImageItem, ImageTitle, WalletList } from './styles'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const ConnectWalletModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const keplrWallet = async () => {
    const chainId = _getChainId()

    suggestChain(chainId)
      .then(() => connectKeplr())
      .then(() => {
        onClose()
      })
      .catch(() => {
        store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
      })
  }

  return (
    <Modal description="Select a Wallet" handleClose={onClose} open={isOpen} title="Select a Wallet">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title withoutMargin>Select a Wallet</Modal.Header.Title>
      </Modal.Header>

      <WalletList>
        <ImageContainer>
          <ImageItem onClick={keplrWallet}>
            <Img alt="Keplr" height={40} src={Keplr} />
            <ImageTitle> Keplr</ImageTitle>
          </ImageItem>
          <ImageItem onClick={keplrWallet}>
            <Img alt="Keplr" height={40} src={Keplr} />
            <ImageTitle> Keplr</ImageTitle>
          </ImageItem>
        </ImageContainer>
      </WalletList>
    </Modal>
  )
}
