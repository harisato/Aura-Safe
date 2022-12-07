// Icons
import keplrIcon from './icon-keplr.svg'
import coin98Icon from './icon-coin98.svg'

import { WALLET_PROVIDER } from 'src/logic/wallets/getWeb3'

const WALLET_ICONS: { [key in WALLET_PROVIDER]: { src: string; height: number } } = {
  [WALLET_PROVIDER.KEPLR]: {
    src: keplrIcon,
    height: 32,
  },
  [WALLET_PROVIDER.COIN98]: {
    src: coin98Icon,
    height: 32,
  },
}

export default WALLET_ICONS
