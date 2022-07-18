import styled from 'styled-components'
import Paragraph from 'src/components/layout/Paragraph'
import { md, lg } from 'src/theme/variables'
import Close from '@material-ui/icons/Close'
import Row from 'src/components/layout/Row'

const StyledParagraph = styled(Paragraph)`
  && {
    font-size: ${lg};
    white-space: nowrap;
    max-width: 370px;
    overflow: hidden;
  }
`
const IconImg = styled.img`
  width: 20px;
  margin-right: 10px;
`
const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledRow = styled(Row)`
  padding: ${md} ${lg};
  justify-content: space-between;
  box-sizing: border-box;
  max-height: 75px;
`

const StyledClose = styled(Close)`
  height: 35px;
  width: 35px;
  color: '#ff0000';
`

const GoBackWrapper = styled.div`
  margin-right: 15px;
`
export { StyledParagraph, IconImg, TitleWrapper, StyledRow, StyledClose, GoBackWrapper }
