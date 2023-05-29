import { EthHashInfo } from '@aura/safe-react-components'
import styled from 'styled-components'

const StyledPrefixedEthHashInfo = styled(EthHashInfo)<{ showHash: any; name: any }>`
  p {
    font-family: 'Inter';
    font-size: ${(props) => (props.name ? '12px' : '14px')};
    line-height: 16px;
    color: white;
  }
  > div {
    margin-right: 8px;
    align-items: ${(props) => (props.showHash ? 'flex-start' : 'center')};
    > img {
      border-radius: 50%;
    }
  }
`

export { StyledPrefixedEthHashInfo }
