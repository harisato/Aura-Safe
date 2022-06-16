import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
export type Props = {
  address: string | undefined
  safeName: string | undefined
  granted: boolean
  balance: string | undefined
  onToggleSafeList: () => void
  onReceiveClick: () => void
  onNewTransactionClick: () => void
}

export type StyledTextLabelProps = {
  chainInfo: ChainInfo
}
