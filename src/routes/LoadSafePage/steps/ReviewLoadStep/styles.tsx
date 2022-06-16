import { border, lg, sm, xs } from 'src/theme/variables'
import styled from 'styled-components'
import Block from 'src/components/layout/Block'
import Row from 'src/components/layout/Row'
import Paragraph from 'src/components/layout/Paragraph'

const DetailsContainer = styled(Block)`
  padding: ${lg};
  border-right: solid 1px ${border};
  height: 100%;
`

const OwnersContainer = styled(Block)`
  padding: ${lg};
`

const OwnerItemContainer = styled(Row)`
  align-items: center;
  min-width: fit-content;
  padding: ${sm};
  padding-left: ${lg};
`

const SafeAddressContainer = styled(Row)`
  margin-top: ${xs};
  align-items: center;
`
const StyledParagraph = styled(Paragraph)`
  margin-top: 4px;
`
export { DetailsContainer, OwnersContainer, OwnerItemContainer, SafeAddressContainer, StyledParagraph }
