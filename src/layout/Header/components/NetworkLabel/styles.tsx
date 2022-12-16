import styled, { css } from 'styled-components'
import Col from 'src/components/layout/Col'
import Paragraph from 'src/components/layout/Paragraph'
import { border, md, screenSm, sm, xs, fontColor } from 'src/theme/variables'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'

export const StyledCol = styled(({ bgColor, txtColor, ...props }) => <Col {...props} />)`
  flex-grow: 0;
  padding: 0 ${sm};
  cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};

  padding: 4px 6px;
  border-radius: 4px;
  background: ${(props) => props?.bgColor};
  color: ${(props) => props?.txtColor};
`

// export const StyledCol = styled(Col)`
//   flex-grow: 0;
//   padding: 0 ${sm};
//   cursor: ${(props) => (props.onClick ? 'pointer' : 'inherit')};

//   border-radius: 4px;
//   padding: 6px 8px;

//   background: ${(props) => props?.bgColor};
//   color: ${(props) => props?.txtColor};

//   @media (min-width: ${screenSm}px) {
//     padding-left: ${md};
//     padding-right: ${md};
//   }
// `
export const StyledParagraph = styled(Paragraph)<{
  $theme: ChainInfo['theme']
}>`
  text-transform: capitalize;
  margin: 0;
  min-width: 70px;
  text-align: center;
  font-family: 'Inter';
  line-height: 16px;
  color: inherit;
`
