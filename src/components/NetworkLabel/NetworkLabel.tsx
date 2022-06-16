import { ReactElement } from 'react'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { getChainInfo } from 'src/config'
import { StyledLabel } from './styles'

type Props = {
  networkInfo?: ChainInfo
  onClick?: () => void
  flexGrow?: boolean
}

function NetworkLabel({ networkInfo, onClick, flexGrow }: Props): ReactElement {
  const selectedNetwork = networkInfo || getChainInfo()

  return (
    <StyledLabel onClick={onClick} flexGrow={flexGrow} {...selectedNetwork.theme}>
      {selectedNetwork.chainName}
    </StyledLabel>
  )
}

export default NetworkLabel
