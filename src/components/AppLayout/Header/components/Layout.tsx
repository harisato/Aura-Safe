import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import List from '@material-ui/core/List'
import Popper from '@material-ui/core/Popper'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

import Provider from './Provider'
import NetworkSelector from './NetworkSelector'
import Spacer from 'src/components/Spacer'
import Col from 'src/components/layout/Col'
import Img from 'src/components/layout/Img'
import Row from 'src/components/layout/Row'
import { headerHeight, md, screenSm, sm } from 'src/theme/variables'
import { useStateHandler } from 'src/logic/hooks/useStateHandler'
import SafeLogo from '../assets/aura-logo.svg'
import { WELCOME_ROUTE } from 'src/routes/routes'
import WalletSwitch from 'src/components/WalletSwitch'
import Divider from 'src/components/layout/Divider'
import { shouldSwitchWalletChain } from 'src/logic/wallets/store/selectors'
import { useSelector } from 'react-redux'

import styled from 'styled-components'
import { useEffect } from 'react'

const styles = () => ({
  root: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '280px',
    padding: 0,
  },
  summary: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexWrap: 'nowrap',
    height: headerHeight,
    position: 'fixed',
    width: '100%',
    zIndex: 1301,
  },
  logo: {
    flexShrink: '0',
    flexGrow: '0',
    padding: sm,
    marginTop: '4px',
    [`@media (min-width: ${screenSm}px)`]: {
      maxWidth: 'none',
      paddingLeft: md,
      paddingRight: md,
    },
  },
  link: {
    textDecoration: 'none',
  },
  wallet: {
    paddingRight: md,
  },
  popper: {
    zIndex: 1301,
  },
  network: {
    backgroundColor: 'white',
    borderRadius: sm,
    boxShadow: '0 0 10px 0 rgba(33, 48, 77, 0.1)',
    marginTop: '11px',
    minWidth: '180px',
    padding: '0',
  },
})

const WalletPopup = ({ anchorEl, providerDetails, classes, open, onClose }) => {
  return (
    <Popper
      anchorEl={anchorEl}
      className={classes.popper}
      open={open}
      placement="bottom"
      popperOptions={{ positionFixed: true }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps}>
          <>
            <ClickAwayListener mouseEvent="onClick" onClickAway={onClose} touchEvent={false}>
              <List className={classes.root} component="div">
                {providerDetails}
              </List>
            </ClickAwayListener>
          </>
        </Grow>
      )}
    </Popper>
  )
}

const Layout = ({ classes, providerDetails, providerInfo, showConnect }) => {
  const { clickAway, open, toggle } = useStateHandler()
  const { clickAway: clickAwayNetworks, open: openNetworks, toggle: toggleNetworks } = useStateHandler()
  const isWrongChain = useSelector(shouldSwitchWalletChain)

  useEffect(() => {
    clickAway()
  }, [showConnect])

  return (
    <Row className={classes.summary}>
      <Col className={classes.logo} middle="xs" start="xs">
        <Link to={WELCOME_ROUTE} className={classes.link}>
          <LogoContainer>
            <Img alt="Aura Safe" height={32} src={SafeLogo} testId="heading-gnosis-logo" />
            <LogoTitle>Aura Safe</LogoTitle>
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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`

const LogoTitle = styled.h2`
background: linear-gradient(108.46deg, #5EE6D0 12.51%, #BFC6FF 51.13%, #FFBA69 87.49%);
-webkit-background-clip: text;
background-clip: text;
-webkit-text-fill-color: transparent;
width: max-content;
`

export default withStyles(styles as any)(Layout)
