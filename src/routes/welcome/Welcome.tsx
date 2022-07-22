import { ReactElement } from 'react'
import { Button, Title, Text } from '@aura/safe-react-components'
import Divider from '@material-ui/core/Divider'
import Page from 'src/components/layout/Page'
import Block from 'src/components/layout/Block'
import Link from 'src/components/layout/Link'
import { LOAD_SAFE_ROUTE, OPEN_SAFE_ROUTE } from 'src/routes/routes'
import {
  CardsContainer,
  StyledCard,
  CardContentContainer,
  CardDescriptionContainer,
  StyledTitle,
  StyledButtonLabel,
  StyledButton,
  StyledTextButton,
  StyledButtonBorder,
  StyledBorder,
} from './styles'
import styled from 'styled-components'
import plusIcon from './assets/plus.svg'

const TitleFont = styled(Title)`
  font-family: 'SFProDisplay';
`
const TextFont = styled(Text)`
  font-family: 'SFProDisplay';
`
function Welcome(): ReactElement {
  return (
    <Page align="center">
      <Block>
        <StyledTitle>
          <TitleFont size="md" strong>
            Welcome to Aura Safe.
          </TitleFont>
          <TitleFont size="xs">
            Aura Safe is the most trusted platform to manage digital assets. <br /> Here is how to get started:
          </TitleFont>
        </StyledTitle>
        <CardsContainer>
          <StyledCard>
            {/* Create Safe */}
            <CardContentContainer>
              <TitleFont size="sm" strong withoutMargin>
                Create Safe
              </TitleFont>
              <CardDescriptionContainer>
                <TextFont size="xl" color="white">
                  Create a new Safe that is controlled by one or multiple owners.
                </TextFont>
                <TextFont size="xl" color="white">
                  You will be required to pay a network fee for creating your new Safe.
                </TextFont>
              </CardDescriptionContainer>
              <StyledButton size="lg" variant="contained" component={Link} to={OPEN_SAFE_ROUTE}>
                {/* <Button> */}
                <StyledTextButton size="xl">
                  <img src={plusIcon} />
                  <p style={{ alignSelf: 'center', marginLeft: 5 }}> Create new Safe</p>
                </StyledTextButton>
                {/* </Button> */}
              </StyledButton>
            </CardContentContainer>
            <Divider orientation="vertical" flexItem />
            <CardContentContainer>
              <TitleFont size="sm" strong withoutMargin>
                Load Existing Safe
              </TitleFont>
              <CardDescriptionContainer>
                <TextFont size="xl" color="white">
                  Already have a Safe or want to access it from a different device? Easily load your Safe using your
                  Safe address.
                </TextFont>
              </CardDescriptionContainer>
              <StyledBorder>
                <StyledButtonBorder iconType="safe" iconSize="sm" size="lg" component={Link} to={LOAD_SAFE_ROUTE}>
                  <StyledButtonLabel size="xl">Add existing Safe</StyledButtonLabel>
                </StyledButtonBorder>
              </StyledBorder>
            </CardContentContainer>
          </StyledCard>
        </CardsContainer>
      </Block>
    </Page>
  )
}

export default Welcome
