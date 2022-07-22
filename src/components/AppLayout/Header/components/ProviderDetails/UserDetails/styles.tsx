import { background, connected as connectedBg, lg, md, sm, warning, xs, bgBox, colorLinear } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'
import styled from 'styled-components'
import { Card } from '@aura/safe-react-components'
export const styles = createStyles({
  container: {
    padding: `${md} 12px`,
    display: 'flex',
    flexDirection: 'column',
  },
  identicon: {
    justifyContent: 'center',
    padding: `0 ${md}`,
  },
  user: {
    borderRadius: '3px',
    backgroundColor: '#222223',
    margin: '0 auto',
    padding: '9px',
    lineHeight: 1,
  },
  details: {
    padding: `0 ${md}`,
    height: '20px',
    alignItems: 'center',
  },
  address: {
    flexGrow: 1,
    textAlign: 'center',
    letterSpacing: '-0.5px',
    marginRight: sm,
  },
  labels: {
    fontSize: '12px',
    letterSpacing: '0.5px',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  open: {
    paddingLeft: sm,
    width: 'auto',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  buttonRow: {
    padding: `${md} ${lg} 0`,
  },
  disconnectButton: {
    marginBottom: `${md}`,
    background: `${colorLinear}`,
    color: '#000',
    boxShadow: 'none',
  },
  dashboard: {
    padding: `${md} ${lg} ${xs}`,
  },
  dashboardText: {
    letterSpacing: '1px',
  },
  logo: {
    margin: `0px ${xs}`,
  },
  warning: {
    color: warning,
  },
  connected: {
    color: connectedBg,
  },
})

export const StyledCard = styled(Card)`
  padding: 0px;
  background-color: ${bgBox};
`
