import { EthHashInfo } from '@aura/safe-react-components'
import styled from 'styled-components'

const StyledPrefixedEthHashInfo = styled(EthHashInfo)`
  p {
    font-family: 'Inter';
    font-size: 12px;
    line-height: 16px;
    color: white;
  }
  > div {
    align-items: center;
    margin-right: 4px;
    > img {
      border-radius: 50%;
    }
  }
`

export { StyledPrefixedEthHashInfo }
