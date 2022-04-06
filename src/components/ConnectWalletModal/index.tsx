import { createStyles } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { ConnectType, useWallet, WalletStatus } from '@terra-money/wallet-provider'
import * as React from 'react'
import { Modal } from 'src/components/Modal'
import styled from 'styled-components'
import { getChainInfo, getInternalChainId, _getChainId } from '../../config'
import { connectKeplr, KeplrErrors, suggestChain } from '../../logic/keplr/keplr'
import { enhanceSnackbarForAction, NOTIFICATIONS } from '../../logic/notifications'
import enqueueSnackbar from '../../logic/notifications/store/actions/enqueueSnackbar'
import { fetchTerraStation } from '../../logic/terraStation'
import { LAST_USED_PROVIDER_KEY } from '../../logic/wallets/store/middlewares/providerWatcher'
import { store } from '../../store'
import { lg } from '../../theme/variables'
import { saveToStorage } from '../../utils/storage'
import Img from '../layout/Img'
import Row from '../layout/Row'

import Keplr from './assets/keplr.svg'
import TerraStation from './assets/terra-station.svg'

type Props = {
  isOpen: boolean
  onClose: () => void
}

const styles = createStyles({
  heading: {
    padding: lg,
    justifyContent: 'space-between',
    maxHeight: '75px',
    boxSizing: 'border-box',
  },
})
const WalletList = styled.div`
  height: fit-content;
  padding: ${lg};
`

const ImageContainer = styled(Row)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 24px;
  grid-row-gap: 0px;
`
const ImageItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: 40px;
  cursor: pointer;
  padding: 0.625em 1.25em;

  transition: box-shadow 150ms ease-in-out, background 200ms ease-in-out;
  transition: opacity 200ms;

  &:hover {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
`
const ImageTitle = styled.span`
  margin-left: 0.66em;
  font-size: 18px;
  font-weight: bold;
  text-align: left;
`

const useStyles = makeStyles(styles)

export const ConnectWalletModal = ({ isOpen, onClose }: Props): React.ReactElement => {
  const classes = useStyles()

  const { status, connect, wallets } = useWallet()

  const keplrWallet = async () => {
    const chainId = _getChainId()
    await connectKeplr()
      .then(async (status) => {
        if (status === KeplrErrors.NoChainInfo) {
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
      connect(ConnectType.EXTENSION, 'station')

      if (status === WalletStatus.WALLET_CONNECTED) {
        const _fetchTerraStation = async () => {
          const chainInfo = await getChainInfo()
          const internalChainId = getInternalChainId()

          const providerInfo = {
            account: wallets[0].terraAddress,
            available: true,
            hardwareWallet: false,
            loaded: true,
            name: 'Terra Station',
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
          <ImageItem onClick={terraWallet}>
            <Img alt="Terra" height={40} src={TerraStation} />
            <ImageTitle> Terra Station </ImageTitle>
          </ImageItem>
        </ImageContainer>
      </WalletList>
    </Modal>
  )
}
