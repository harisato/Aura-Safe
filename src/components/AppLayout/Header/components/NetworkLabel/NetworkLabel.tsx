import * as React from 'react'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { getChainInfo } from 'src/config'
import { StyledCol, StyledParagraph } from './styles'

const NetworkLabel = ({
  networkInfo,
  onClick,
}: {
  networkInfo?: ChainInfo
  onClick?: () => void
}): React.ReactElement => {
  const chain = networkInfo || getChainInfo()

  return (
    <StyledCol middle="xs" start="xs" onClick={onClick}>
      <StyledParagraph size="md" $theme={chain.theme}>
        {chain.chainName}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
