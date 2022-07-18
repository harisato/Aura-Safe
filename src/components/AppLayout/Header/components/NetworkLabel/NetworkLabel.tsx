import * as React from 'react'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import { getChainInfo } from 'src/config'
import { StyledCol, StyledParagraph } from './styles'
import { CHAIN_THEMES, THEME_DF } from 'src/services/constant/chainThemes'

const NetworkLabel = ({
  networkInfo,
  onClick,
}: {
  networkInfo?: ChainInfo
  onClick?: () => void
  theme?: {
    textColor: string
    backgroundColor: string
  }
}): React.ReactElement => {
  const chain = networkInfo || getChainInfo()
  const theme = CHAIN_THEMES[chain.chainId] || THEME_DF;

  return (
    <StyledCol middle="xs" start="xs" onClick={onClick} bgColor={theme.backgroundColor} txtColor={theme.textColor}>
      <StyledParagraph size="sm" $theme={chain.theme} weight="semiBold" color="soft">
        {chain.chainName}
      </StyledParagraph>
    </StyledCol>
  )
}

export default NetworkLabel
