import styled from 'styled-components'
import { Card, Text, Button } from '@aura/safe-aura-components'
import { colorLinear, borderLinear } from 'src/theme/variables'
const CardsContainer = styled.div`
  display: flex;
  height: 300px;
  max-width: 850px;
`

const StyledCard = styled(Card)`
  display: flex;
  flex: 0 1 100%;
  padding: 0;
  background-color: rgba(18, 18, 18, 1);
  border-radius-top: 5px;
  border: 1px solid rgba(62, 63, 64, 1);
`

const CardContentContainer = styled.div`
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  padding: 24px;
  align-items: flex-start;
  color: white;
`

const StyledButtonLabel = styled(Text)`
  color: white;
  background-color: transparent !important;
  font-family: 'SFProDisplay';
`

const CardDescriptionContainer = styled.div`
  margin-top: 16px;
  margin-bottom: auto;
`
const StyledTitle = styled.div`
  color: white;
`

const StyledButton = styled(Button)`
  background: ${colorLinear};
  border-radius: 50px !important;
`

const StyledTextButton = styled(Text)`
  color: black;
  font-family: 'SFProDisplay';
  display: flex;
  justify-content: center;
  align-item: center;
`

const StyledButtonBorder = styled(Button)`
  background-color: rgba(18, 18, 18, 1) !important;
  border-radius: 50px !important;
  svg {
    width: 28px;
    height: 28px;
  }
`

const StyledBorder = styled.div`
  border-radius: 50px !important;
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
`

export {
  CardsContainer,
  StyledCard,
  CardContentContainer,
  StyledButtonLabel,
  CardDescriptionContainer,
  StyledTitle,
  StyledButton,
  StyledTextButton,
  StyledButtonBorder,
  StyledBorder,
}
