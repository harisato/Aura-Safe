// Icons
import keplrIcon from './icon-keplr.svg'

import { WALLET_PROVIDER } from 'src/logic/wallets/getWeb3'

const WALLET_ICONS: { [key in WALLET_PROVIDER]: { src: string; height: number } } = {
  // [WALLET_PROVIDER.METAMASK]: {
  //   src: metamaskIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.WALLETCONNECT]: {
  //   src: walletConnectIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.TREZOR]: {
  //   src: trezorIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.LEDGER]: {
  //   src: ledgerIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.TRUST]: {
  //   src: trustIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.LATTICE]: {
  //   src: latticeIcon,
  //   height: 41,
  // },
  // [WALLET_PROVIDER.KEYSTONE]: {
  //   src: keystoneIcon,
  //   height: 41,
  // },
  // [WALLET_PROVIDER.FORTMATIC]: {
  //   src: fortmaticIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.PORTIS]: {
  //   src: portisIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.AUTHEREUM]: {
  //   src: authereumIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.TORUS]: {
  //   src: torusIcon,
  //   height: 30,
  // },
  // [WALLET_PROVIDER.OPERA]: {
  //   src: operaIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.COINBASE_WALLET]: {
  //   src: coinbaseIcon,
  //   height: 25,
  // },
  // [WALLET_PROVIDER.SQUARELINK]: {
  //   src: squarelinkIcon,
  //   height: 25,
  // },
  [WALLET_PROVIDER.KEPLR]: {
    src: keplrIcon,
    height: 32,
  },
}

export default WALLET_ICONS
