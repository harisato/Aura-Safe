import { withStyles } from '@material-ui/core/styles'
import { ReactElement } from 'react'
import ConnectButton from 'src/components/ConnectButton'
import Block from 'src/components/layout/Block'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { KeyRing } from 'src/layout/Header/components/KeyRing/KeyRing'
import { StyledCard, styles } from './styles'

const ConnectDetails = ({
  classes,
  connectButtonClick,
}: {
  classes: any
  connectButtonClick: () => void
}): ReactElement => (
  <StyledCard>
    <Row align="center" margin="lg">
      <Paragraph className={classes.text} noMargin size="xl" weight="bolder">
        Connect a Wallet
      </Paragraph>
    </Row>

    <Row className={classes.logo}>
      <KeyRing center circleSize={60} dotRight={20} dotSize={20} dotTop={50} keySize={28} mode="error" />
    </Row>
    <Block className={classes.connect}>
      <ConnectButton onConnect={connectButtonClick} data-testid="heading-connect-btn" />
    </Block>
  </StyledCard>
)

export default withStyles(styles as any)(ConnectDetails)
