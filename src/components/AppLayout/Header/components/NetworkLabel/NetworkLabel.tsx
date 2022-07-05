import * as React from 'react'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { getChainInfo } from 'src/config'
import { StyledCol, StyledParagraph } from './styles'

const NetworkLabel = ({
  networkInfo,
  onClick,
  noBackground = false
}: {
  networkInfo?: ChainInfo
  onClick?: () => void
  noBackground?: boolean
}): React.ReactElement => {
  const chain = networkInfo || getChainInfo()

  return (
    <StyledCol middle="xs" start="xs" onClick={onClick}>
      <StyledParagraph size="md" $theme={chain.theme} weight='semiBold' color='soft'>
        {chain.chainName}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
