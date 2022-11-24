import { withStyles } from '@material-ui/core/styles'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import Col from 'src/components/layout/Col'
import Divider from 'src/components/layout/Divider'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import Spacer from 'src/components/Spacer'
import WalletSwitch from 'src/components/WalletSwitch'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { WELCOME_ROUTE } from 'src/routes/routes'
import { IS_PRODUCTION } from 'src/utils/constants'
import SafeLogo from '../../assets/logoAura.svg'
import NetworkSelector from '../NetworkSelector/NetworkSelector'
import Provider from '../Provider/Provider'
import { LogoContainer, styles, DevelopBanner } from './styles'
import WalletPopup from './WalletPopup/WalletPopup'

const Layout = (props: any) => {
  const { classes, providerDetails, providerInfo, showConnect, openConnectWallet } = props
  const { clickAway, open, toggle } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const isWrongChain = useSelector(shouldSwitchWalletChain)
  const getDevnetLabel = () => {
    console.log(window.location.hostname)
    switch (window.location.hostname) {
      case 'safe.serenity.aura.network':
        return 'Serenity Testnet Network'
      case 'test.pyxis.aura.networks':
        return 'Euphoria Testnet Network'
      default:
        return 'Develop Testnet Network'
    }
  }

  useEffect(() => {
    clickAway()
  }, [showConnect])

  // const TOGGLE_SIDEBAR_BTN_TESTID = 'TOGGLE_SIDEBAR_BTN'
  return (
    <Row className={classes.summary}>
      {/* <IconButton className={classes.menu} onClick={onToggleSafeList} data-testid={TOGGLE_SIDEBAR_BTN_TESTID}>
        <MenuIcon type={'button'} />
      </IconButton> */}
      <Col className={classes.logo} middle="xs" start="xs">
        <Link to={WELCOME_ROUTE} className={classes.link}>
          <LogoContainer>
            <Img alt="Aura Safe" height={40} src={SafeLogo} testId="heading-gnosis-logo" />
          </LogoContainer>
        </Link>
        {!IS_PRODUCTION && <DevelopBanner>{getDevnetLabel()}</DevelopBanner>}
      </Col>

      <Spacer />

      {isWrongChain && (
        <div className={classes.wallet}>
          <WalletSwitch openConnectWallet={openConnectWallet} />
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
