import { disabled, extraSmallFontSize, lg, sm, xs } from 'src/theme/variables'
import Block from 'src/components/layout/Block'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Paragraph from 'src/components/layout/Paragraph'
import styled from 'styled-components'
import { Link } from '@gnosis.pm/safe-react-components'
import Row from 'src/components/layout/Row'
import Field from 'src/components/forms/Field'
import Col from 'src/components/layout/Col'

const BlockWithPadding = styled(Block)`
  padding: ${lg};
`

const ParagraphWithMargin = styled(Paragraph)`
  margin-bottom: 12px;
`

const StyledLink = styled(Link)`
  padding: 0 ${xs};
  & svg {
    position: relative;
    top: 1px;
    left: ${xs};
    height: 14px;
    width: 14px;
  }
`
const RowHeader = styled(Row)`
  padding: ${sm} ${lg};
  font-size: ${extraSmallFontSize};
  color: ${disabled};
`

const OwnerNameField = styled(Field)`
  margin-right: ${sm};
  margin-bottom: ${sm};
`
const CheckIconAddressAdornment = styled(CheckCircle)`
  color: #03ae60;
  height: 20px;
`

const OwnersIconsContainer = styled(Col)`
  height: 56px;
  max-width: 32px;
  cursor: pointer;
`

const OwnerContainer = styled(Row)`
  justify-content: center;
`

const StyledParagraph = styled(Paragraph)`
  padding-left: 12px;
  color: white;
`
export {
  BlockWithPadding,
  ParagraphWithMargin,
  StyledLink,
  RowHeader,
  OwnerNameField,
  CheckIconAddressAdornment,
  OwnersIconsContainer,
  OwnerContainer,
  StyledParagraph,
}
