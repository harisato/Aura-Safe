import IconButton from '@material-ui/core/IconButton'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import { ReactElement } from 'react'

import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { ChainInfo } from '@gnosis.pm/safe-react-gateway-sdk'
import Hairline from 'src/components/layout/Hairline'
import Paragraph from 'src/components/layout/Paragraph'
import Row from 'src/components/layout/Row'
import { getChainInfo, getExplorerInfo } from 'src/config'
import { fontColor, lg, md, screenSm, secondaryText } from 'src/theme/variables'
import { borderLinear } from 'src/theme/variables'
import Logo from 'src/assets/icons/Logo.svg'
import session from 'src/utils/storage/session'
import { store } from 'src/store'
import { setTerm } from 'src/logic/checkTerm/store/actions/setTerm'
import { handleConnectWallet } from 'src/logic/providers'

import enqueueSnackbar from 'src/logic/notifications/store/actions/enqueueSnackbar'
import { enhanceSnackbarForAction, NOTIFICATIONS } from 'src/logic/notifications'
import { TermSelector } from 'src/logic/checkTerm/store/selector'

const useStyles = (chainInfo: ChainInfo) =>
  makeStyles(
    createStyles({
      heading: {
        padding: `${md} ${lg}`,
        justifyContent: 'space-between',
        height: '74px',
        boxSizing: 'border-box',
      },
      close: {
        height: lg,
        width: lg,
        fill: secondaryText,
      },
      annotation: {
        margin: lg,
        marginBottom: 0,
        justifyContent: 'center',
      },
      buttonRow: {
        height: '84px',
        justifyContent: 'flex-end',
        marginRight: 50,
      },
      logo: {
        width: 100,
      },
    }),
  )()

const StyledButton = styled.div`
  display: flex;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 30px;
  background-color: transparent;
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
  margin-left: 10px;
`

const StyledButtonClose = styled.div`
  display: flex;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 30px;
  background-color: transparent;
  background-image: ${borderLinear};
  cursor: pointer;
  margin-left: 10px;
`

type Props = {
  onClose: () => void
  safeAddress: string
  safeName: string
}

const ReceiveModal = ({ onClose, safeAddress, safeName }: Props): ReactElement => {
  const chainInfo = getChainInfo()
  const termValue = useSelector(TermSelector).termValue
  const classes = useStyles(chainInfo)

  const handleAccpect = () => {
    handleConnectWallet(
      termValue.keplr,
      termValue.chainInfo,
      termValue.key,
      termValue.chainId,
      termValue.internalChainId,
      termValue._providerInfo,
    )
    store.dispatch(setTerm({ checkTerm: false, termValue: null }))
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Terms of Service and Privacy Policy
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />
      <Paragraph className={classes.annotation} noMargin align="center" weight="bolder" size="lg">
        Welcome to Pyxis Safe
      </Paragraph>
      <Paragraph align="center">
        <img src={Logo} className={classes.logo} />
      </Paragraph>
      <Paragraph align="center" size="sx">
        By connecting your walletand using Pyxis Safe, you agree to our Terms of Service and Privacy Policy
      </Paragraph>
      <Hairline />
      <Row align="center" className={classes.buttonRow}>
        <StyledButtonClose onClick={onClose}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Cancel</span>
        </StyledButtonClose>
        <StyledButton onClick={handleAccpect}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Accept and sign</span>
        </StyledButton>
      </Row>
    </>
  )
}

export default ReceiveModal
