import { border, fontColor } from 'src/theme/variables'
import styled from 'styled-components'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { Icon, Text, Button } from '@gnosis.pm/safe-react-components'
import { StyledTextLabelProps } from './type'
import { colorLinear } from 'src/theme/variables'

const Container = styled.div`
  max-width: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const IdenticonContainer = styled.div`
  width: 100%;
  margin: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  div:first-of-type {
    width: 32px;
  }
`
const StyledIcon = styled(Icon)`
  svg {
    height: 26px;
    width: 26px;
    transform: rotateZ(-90deg);

    path:nth-child(2) {
      display: none;
    }
  }
`

const IconContainer = styled.div`
  width: 100px;
  display: flex;
  padding: 4px 0;
  justify-content: space-evenly;
`
const StyledButton = styled(Button)`
  background: ${colorLinear};
  border-radius: 50px !important;
  &&.MuiButton-root {
    padding: 0 12px;
  }
  *:first-child {
    margin: 0 4px 0 0;
  }
`

const StyledTextLabel = styled(Text)`
  margin: -8px 0 4px -8px;
  padding: 4px 8px;
  width: 100%;
  text-align: center;
  color: ${(props: StyledTextLabelProps) => props.chainInfo?.theme?.textColor ?? fontColor};
  background-color: ${(props: StyledTextLabelProps) => props.chainInfo?.theme?.backgroundColor ?? border};
`

const StyledTextSafeName = styled(Text)`
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  p {
    color: ${({ theme }) => theme.colors.white};
    font-size: 14px;
  }
`

const StyledLabel = styled.div`
  background-color: ${({ theme }) => theme.colors.icon};
  margin: 4px 0 0 0 !important;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
  p {
    line-height: 18px;
  }
`
const StyledText = styled(Text)`
  margin: 8px 0 16px 0;
`
export {
  Container,
  IdenticonContainer,
  StyledIcon,
  IconContainer,
  StyledButton,
  StyledTextLabel,
  StyledTextSafeName,
  StyledPrefixedEthHashInfo,
  StyledLabel,
  StyledText,
}
