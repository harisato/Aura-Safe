import React from 'react'
import { Modal } from 'src/components/Modal'
import { getInternalChainId, _getChainId } from '../../config'
import { connectKeplr, KeplrErrors, suggestChain } from '../../logic/keplr/keplr'
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
  // const internalChainId = getInternalChainId()

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

    // await connectKeplr()
    //   .then(async (status) => {
    //     if (status === KeplrErrors.NoChainInfo) {
    //       await suggestChain(chainId)
    //       return true
    //     }
    //     onClose()
    //     return null
    //   })
    //   .then((e) => {
    //     if (e) {
    //       connectKeplr()
    //     }
    //   })
    //   .catch(() => {
    //     store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
    //   })
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

          {/* {internalChainId !== 20 ? null : (
            <ImageItem onClick={terraWallet}>
              <Img alt="Terra" height={40} src={TerraStation} />
              <ImageTitle> Terra Station </ImageTitle>
            </ImageItem>
          )} */}
        </ImageContainer>
      </WalletList>
    </Modal>
  )
}
