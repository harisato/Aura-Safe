import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import Block from 'src/components/layout/Block'
import styled from 'styled-components'
import { lg, bgBox } from 'src/theme/variables'

const Container = styled(Block)`
  padding: ${lg};
  background-color: ${bgBox};
  border-radius: 8px;
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  margin-bottom: 1em;
`
export { Container, StyledPrefixedEthHashInfo }
