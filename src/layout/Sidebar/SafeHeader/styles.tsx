import { border, fontColor } from 'src/theme/variables'
import styled from 'styled-components'
import PrefixedEthHashInfo from 'src/components/PrefixedEthHashInfo'
import { Icon, Text, Button } from '@aura/safe-react-components'
import { StyledTextLabelProps } from './type'
import { borderLinear } from 'src/theme/variables'

const Container = styled.div`
  max-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #404047;
  padding: 24px 16px;
  .icon-color {
    fill: #fff;
  }
`

const IdenticonContainer = styled.div`
  width: 100%;
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
  flex-grow: 1;
  display: flex;
  padding: 4px 0;
  justify-content: center;
  gap: 6px;
`
const StyledButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
  svg {
    margin-right: 5px;
  }
`

const StyledTextLabel = styled(Text)`
  padding: 8px;
  text-align: center;
  color: ${(props: StyledTextLabelProps) => props.chainInfo?.theme?.textColor ?? fontColor};
  background-color: #363843;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter';
  div {
    margin-right: 5px;
  }
`

const StyledTextSafeName = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  color: #98989b;
  text-align: start;
`
const StyledTextSafeNameWrapper = styled.div`
  flex-grow: 1;
`

const StyledPrefixedEthHashInfo = styled(PrefixedEthHashInfo)`
  p {
    color: ${({ theme }) => theme.colors.white};
    font-size: 14px;
  }
`

const StyledLabel = styled.div`
  background-color: ${({ theme }) => theme.colors.icon};
  margin: 8px 0 0 0 !important;
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

const StyledDotChainName = styled.span`
  width: 8px;
  height: 8px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 5px;
`

const ContainerChainName = styled.div``

const StyledIdenticonContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  gap: 12px;
`

const ContainerButton = styled.div`
  margin-top: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  StyledDotChainName,
  ContainerChainName,
  StyledIdenticonContainer,
  ContainerButton,
  StyledTextSafeNameWrapper,
}
