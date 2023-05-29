import React, { useCallback, useContext } from 'react'

import { Modal } from 'src/components/Modal'
import { connectProvider } from 'src/logic/providers'
import { WALLETS_NAME } from 'src/logic/wallets/constant/wallets'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { store } from '../../logic/safe/store'
import Img from '../layout/Img'
import { ImageContainer, ImageItem, ImageTitle, WalletList } from './styles'

import Coin98 from './assets/Coin98.svg'
import Keplr from './assets/keplr.svg'
import { checkExistedCoin98 } from 'src/logic/providers/utils/wallets'
import TermContext from 'src/logic/TermContext'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const ConnectWalletModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const termContext = useContext(TermContext)

  const handleConnect = useCallback(
    (walletsName: WALLETS_NAME) => {
      try {
        if (walletsName === WALLETS_NAME.Coin98) {
          const coin98 = checkExistedCoin98()

          if (!coin98) {
            window.open('https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg')
            return
          }
        }
        connectProvider(walletsName, termContext)
          .then((res) => {
            onClose()
          })
          .catch((error) => {
            console.error('error 3', error)
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
      } catch (error) {
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
          <ImageItem
            onClick={() => {
              handleConnect(WALLETS_NAME.Coin98)
            }}
          >
            <Img alt="Coin98" height={40} src={Coin98} />
            <ImageTitle> Coin98 </ImageTitle>
          </ImageItem>

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
