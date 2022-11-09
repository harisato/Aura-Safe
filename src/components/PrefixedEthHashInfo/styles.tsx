import { EthHashInfo } from '@aura/safe-react-components'
import styled from 'styled-components'

const StyledPrefixedEthHashInfo = styled(EthHashInfo)`
  p {
    font-family: 'SFProDisplay';
    font-size: 12px;
    color: white;
  }
  > div > img {
    border-radius: 50%;
  }
`

export { StyledPrefixedEthHashInfo }
