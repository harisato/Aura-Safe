import { Text } from '@aura/safe-react-components'
import { ReactElement } from 'react'
import styled from 'styled-components'

import { Token } from 'src/logic/tokens/store/model/token'
import { setImageToPlaceholder } from 'src/routes/safe/components/Balances/utils'

const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  object-fit: contain;
  margin: 0 8px 0 0;
`
const StyledImageName = styled.div`
  display: flex;
  align-items: center;
`

interface TokenInfoProps {
  amount: string
  title?: string
  token: Token
}

const TokenInfo = ({ amount, title, token }: TokenInfoProps): ReactElement => (
  <>
    <Text size="xl" strong>
      {title}
    </Text>
    <StyledImageName>
      <StyledImage alt={token.name} onError={setImageToPlaceholder} src={token.logoUri || ''} />
      <Text size="lg">
        {amount} {token.symbol}
      </Text>
    </StyledImageName>
  </>
)

export default TokenInfo
