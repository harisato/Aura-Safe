import styled from 'styled-components'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

export const StyledCol = styled(Col)`
  flex-grow: 0;
  padding: 0 ${sm};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};
  @media (min-width: ${screenSm}px) {
    padding-left: ${md};
    padding-right: ${md};
  }
`
export const StyledParagraph = styled(Paragraph)<{
  $theme: ChainInfo['theme']
}>`
  // background-color: ${(props) => props?.$theme?.backgroundColor ?? border};
  // color: ${(props) => props?.$theme?.textColor ?? fontColor};
  color: #5ee6d0;
  border-radius: 3px;
  line-height: normal;
  text-transform: capitalize;
  margin: 0;
  // padding: ${xs} ${sm};
  min-width: 70px;
  text-align: center;
`
