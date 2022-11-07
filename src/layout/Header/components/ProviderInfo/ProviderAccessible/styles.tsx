import { connected as connectedBg, screenSm, sm } from 'src/theme/variables'
import { createStyles } from '@material-ui/core/styles'
export const styles = createStyles({
  network: {
    fontFamily: 'SFProDisplay, sans-serif',
  },
  networkLabel: {
    '& div': {
      paddingRight: sm,
      paddingLeft: sm,
    },
  },
  identicon: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  dot: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    color: connectedBg,
    display: 'none',
    height: '15px',
    position: 'relative',
    right: '10px',
    top: '12px',
    width: '15px',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'block',
    },
  },
  providerContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    width: '100px',
    '& span': {
      color: 'white',
    },
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'left',
    paddingRight: sm,
  },
  address: {
    marginLeft: '5px',
    letterSpacing: '-0.5px',
  },
})
