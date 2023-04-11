import 'styled-components'
import { theme } from '@aura/safe-react-components'
import { Keplr } from '@keplr-wallet/types'

type Theme = typeof theme

export {}
declare global {
  interface Window {
    isDesktop?: boolean
    ethereum?: {
      autoRefreshOnNetworkChange: boolean
      isMetaMask: boolean
    }
    keplr: Keplr
    coin98
  }
}
declare module '@openzeppelin/contracts/build/contracts/ERC721'
declare module 'currency-flags/dist/currency-flags.min.css'
