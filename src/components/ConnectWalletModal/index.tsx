import { ConnectType, useWallet, WalletStatus } from '@terra-money/wallet-provider'
import React, { useEffect } from 'react'
import { Modal } from 'src/components/Modal'
import { getChainInfo, getInternalChainId, _getChainId } from '../../config'
import { connectKeplr, KeplrErrors, suggestChain } from '../../logic/keplr/keplr'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { fetchTerraStation } from '../../logic/terraStation'
import { WALLETS_NAME } from '../../logic/wallets/constant/wallets'
import { LAST_USED_PROVIDER_KEY } from '../../logic/wallets/store/middlewares/providerWatcher'
import { store } from '../../store'
import { saveToStorage } from '../../utils/storage'
import Img from '../layout/Img'
import Keplr from './assets/keplr.svg'
import TerraStation from './assets/terra-station.svg'
import { WalletList, ImageContainer, ImageItem, ImageTitle } from './styles'
import { coins, MsgSendEncodeObject, SignerData, SigningStargateClient } from '@cosmjs/stargate'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const ConnectWalletModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const { status, connect, wallets } = useWallet()
  const internalChainId = getInternalChainId()

  useEffect(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      const _fetchTerraStation = async () => {
        const chainInfo = await getChainInfo()

        const providerInfo = {
          account: wallets[0].terraAddress,
          available: true,
          hardwareWallet: false,
          loaded: true,
          name: WALLETS_NAME.TerraStation,
          network: chainInfo.chainId,
          smartContractWallet: false,
          internalChainId,
        }

        fetchTerraStation(providerInfo)

        saveToStorage(LAST_USED_PROVIDER_KEY, providerInfo.name)
        onClose()
      }

      _fetchTerraStation()
    }
  }, [status])

  const keplrWallet = async () => {
    const chainId = _getChainId()
    await connectKeplr()
      .then(async (status) => {
        if (status === KeplrErrors.NoChainInfo) {
          console.log(1)
          await suggestChain(chainId)
          return true
        }
        onClose()
        return null
      })
      .then((e) => {
        if (e) {
          connectKeplr()
        }
      })
      .catch(() => {
        store.dispatch(enqueueSnackbar(enhanceSnackbarForAction(NOTIFICATIONS.CONNECT_WALLET_ERROR_MSG)))
      })
  }

  const terraWallet = () => {
    try {
      if (status === WalletStatus.WALLET_NOT_CONNECTED) {
        connect(ConnectType.EXTENSION, 'station')
      }
    } catch (e) {
      console.error(e)
    }
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
