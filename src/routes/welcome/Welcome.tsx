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
import walletIcon from './assets/wallet.svg'

const TitleFont = styled(Title)`
  font-family: 'Inter';
`
const TextFont = styled(Text)`
  font-family: 'Inter';
`
function Welcome(): ReactElement {
  return (
    <Page align="center">
      <Block>
        <StyledTitle>
          <TitleFont size="md" strong>
            Welcome to Pyxis Safe.
          </TitleFont>
          <TitleFont size="xs">
            Pyxis Safe is the go-to platform for multi-signature asset management on the Interchain.
            <br /> Here is how to get started:
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
                  Creating a Safe is totally free of charge.
                </TextFont>
              </CardDescriptionContainer>
              <StyledButton size="lg" variant="contained" component={Link} to={OPEN_SAFE_ROUTE}>
                {/* <Button> */}
                <StyledTextButton size="xl">
                  <img src={plusIcon} />
                  <span style={{ alignSelf: 'center', marginLeft: 5 }}> Create new Safe</span>
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
                <StyledButtonBorder iconSize="sm" size="lg" component={Link} to={LOAD_SAFE_ROUTE}>
                  <img src={walletIcon} />
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
