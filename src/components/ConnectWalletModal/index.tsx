import React from 'react'
import { Modal } from 'src/components/Modal'
import { _getChainId } from '../../config'
import { connectKeplr, suggestChain } from '../../logic/keplr/keplr'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { store } from '../../store'
import Img from '../layout/Img'
import { ImageContainer, ImageItem, ImageTitle, WalletList } from './styles'

import Keplr from './assets/keplr.svg'
import Coin98 from './assets/Coin98.svg'
import { isCoin98Installed } from 'src/logic/providers/coin98'

type Props = {
  isOpen: boolean
  onClose: () => void
}

async function handleGetKeyCosmos(): Promise<void> {
  const chainId = 'aura-testnet'

  try {
    const result = await window.coin98.cosmos.request({
      method: 'cosmos_getKey',
      params: [chainId],
    })

    console.log('cosmos_getKey', { result })

    return result || {}
  } catch (err) {
    console.log({ err })
  }
}

export const ConnectWalletModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const chainId = _getChainId()
  const keplrWallet = async () => {
    suggestChain(chainId)
      .then(() => connectKeplr())
      .then(() => {
        onClose()
      })
      .catch(() => {
        store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
      })
  }

  const coin98Wallet = async () => {
    const isInstalled = isCoin98Installed()

    console.log('isInstalled', isInstalled)

    // suggestChain(chainId)
    //   .then(() => connectKeplr())
    //   .then(() => {
    //     onClose()
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
          <ImageItem onClick={coin98Wallet}>
            <Img alt="Coin98" height={40} src={Coin98} />
            <ImageTitle> Coin98 </ImageTitle>
          </ImageItem>
          <ImageItem onClick={keplrWallet}>
            <Img alt="Keplr" height={40} src={Keplr} />
            <ImageTitle> Keplr </ImageTitle>
          </ImageItem>
        </ImageContainer>
      </WalletList>
    </Modal>
  )
}
