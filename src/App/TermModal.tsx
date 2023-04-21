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
import { store } from 'src/logic/safe/store'
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
  valueTerm: any
}

const ReceiveModal = ({ onClose, valueTerm }: Props): ReactElement => {
  const chainInfo = getChainInfo()
  const classes = useStyles(chainInfo)

  const handleAccpect = () => {
    handleConnectWallet(
      valueTerm.keplr,
      valueTerm.chainInfo,
      valueTerm.key,
      valueTerm.chainId,
      valueTerm.internalChainId,
      valueTerm._providerInfo,
    ).then((res) => {
      onClose()
    })
  }

  return (
    <>
      <Row align="center" className={classes.heading} grow>
        <Paragraph noMargin size="xl" weight="bolder">
          Welcome to Pyxis Safe!
        </Paragraph>
        <IconButton disableRipple onClick={onClose}>
          <Close className={classes.close} />
        </IconButton>
      </Row>
      <Hairline />

      <Paragraph align="center">
        <img src={Logo} className={classes.logo} />
      </Paragraph>
      <Paragraph align="center" size="sx">
        As this is the first time you use Pyxis Safe, please have a look and accept our Term of Service and Privacy
        Policy before using.
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
