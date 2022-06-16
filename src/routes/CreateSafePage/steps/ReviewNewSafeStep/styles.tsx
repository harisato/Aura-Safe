import { background, border, lg, sm, bgBox } from 'src/theme/variables'
import styled from 'styled-components'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'

const DetailsContainer = styled(Block)`
  padding: ${lg};
  border-right: solid 1px ${border};
  height: 100%;
`

const SafeNameParagraph = styled(Paragraph)`
  text-overflow: ellipsis;
  overflow: hidden;
`
const TitleContainer = styled(Block)`
  padding: ${lg};
`

const OwnersAddressesContainer = styled(Row)`
  align-items: center;
  min-width: fit-content;
  padding: ${sm};
  padding-left: ${lg};
`
const DescriptionContainer = styled(Row)`
  background-color: ${bgBox};
  padding: ${lg};
  text-align: center;
  border-top: solid 1px ${border};
`

export { DetailsContainer, SafeNameParagraph, TitleContainer, OwnersAddressesContainer, DescriptionContainer }
