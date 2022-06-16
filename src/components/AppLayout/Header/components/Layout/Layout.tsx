import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Provider from '../Provider/Provider'
import NetworkSelector from '../NetworkSelector/NetworkSelector'
import Spacer from 'src/components/Spacer'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import WalletPopup from './WalletPopup/WalletPopup'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import SafeLogo from '../../assets/logoAura.svg'
import { WELCOME_ROUTE } from 'src/routes/routes'
import WalletSwitch from 'src/components/WalletSwitch'
import Divider from 'src/components/layout/Divider'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import IconButton from '@material-ui/core/IconButton'
import { styles, LogoContainer } from './styles'

const Layout = (props: any) => {
  const { classes, providerDetails, providerInfo, showConnect, onToggleSafeList } = props
  const { clickAway, open, toggle } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const isWrongChain = useSelector(shouldSwitchWalletChain)

  useEffect(() => {
    clickAway()
  }, [showConnect])

  const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'
  return (
    <Row className={classes.summary}>
      <IconButton className={classes.menu} onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
        <MenuIcon type={'button'} />
      </IconButton>
      <Col className={classes.logo} middle="xs" start="xs">
        <Link to={WELCOME_ROUTE} className={classes.link}>
          <LogoContainer>
            <Img alt="Aura Safe" height={40} src={SafeLogo} testId="heading-gnosis-logo" />
          </LogoContainer>
        </Link>
      </Col>

      <Spacer />

      {isWrongChain && (
        <div className={classes.wallet}>
          <WalletSwitch />
          <Divider />
        </div>
      )}

      <Provider
        info={providerInfo}
        open={open}
        toggle={toggle}
        render={(providerRef) =>
          providerRef.current && (
            <WalletPopup
              anchorEl={providerRef.current}
              providerDetails={providerDetails}
              open={open}
              classes={classes}
              onClose={clickAway}
            />
          )
        }
      />

      <NetworkSelector open={openNetworks} toggle={toggleNetworks} clickAway={clickAwayNetworks} />
    </Row>
  )
}

export default withStyles(styles as any)(Layout)
