import CheckCircle from '@material-ui/icons/CheckCircle'
import Field from 'src/components/forms/Field'
import Block from 'src/components/layout/Block'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { descriptionAura, extraSmallFontSize, lg, mediumFont, sm } from 'src/theme/variables'
import styled from 'styled-components'

const BlockWithPadding = styled(Block)`
  padding: ${lg};
`

const ParagraphWithMargin = styled(Paragraph)`
  margin-bottom: 12px;
`

const RowHeader = styled(Row)`
  padding: ${sm} ${lg};
  font-size: ${extraSmallFontSize};
  color: ${descriptionAura};
  font-weight: ${mediumFont};
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
  justify-content: flex-start;
`

const StyledParagraph = styled(Paragraph)`
  padding-left: 12px;
  color: #e6e7e8;
`

const FieldStyled = styled(Field)`
  color: white;
  div {
    color: white;
  }
  input {
    color: white;
  }
`

export {
  BlockWithPadding,
  ParagraphWithMargin,
  RowHeader,
  OwnerNameField,
  CheckIconAddressAdornment,
  OwnersIconsContainer,
  OwnerContainer,
  StyledParagraph,
  FieldStyled,
}
