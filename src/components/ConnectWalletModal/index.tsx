import React, { useCallback, useEffect, useState } from 'react'

import { Modal } from 'src/components/Modal'
import { connectProvider } from 'src/logic/providers'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { store } from '../../store'
import Img from '../layout/Img'
import { ImageContainer, ImageItem, ImageTitle, WalletList } from './styles'

import Coin98 from './assets/Coin98.svg'
import Keplr from './assets/keplr.svg'
import { checkExistedCoin98 } from 'src/logic/providers/utils/wallets'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const ConnectWalletModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const [coin98, setCoin98] = useState(false)

  useEffect(() => {
    if (checkExistedCoin98()) {
      setCoin98(true)
    }
  }, [])

  const handleConnect = useCallback(
    (walletsName: WALLETS_NAME) => {
      try {
        connectProvider(walletsName)
          .then(() => {
            onClose()
          })
          .catch(() => {
            store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
          })
      } catch (e) {
        store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
        console.log(e)
      }
    },
    [onClose],
  )

  return (
    <Modal description="Select a Wallet" handleClose={onClose} open={isOpen} title="Select a Wallet">
      <Modal.Header onClose={onClose}>
        <Modal.Header.Title withoutMargin>Select a Wallet</Modal.Header.Title>
      </Modal.Header>

      <WalletList>
        <ImageContainer>
          {coin98 && (
            <ImageItem
              onClick={() => {
                handleConnect(WALLETS_NAME.Coin98)
              }}
            >
              <Img alt="Coin98" height={40} src={Coin98} />
              <ImageTitle> Coin98 </ImageTitle>
            </ImageItem>
          )}
          <ImageItem
            onClick={() => {
              handleConnect(WALLETS_NAME.Keplr)
            }}
          >
            <Img alt="Keplr" height={40} src={Keplr} />
            <ImageTitle> Keplr </ImageTitle>
          </ImageItem>
        </ImageContainer>
      </WalletList>
    </Modal>
  )
}
