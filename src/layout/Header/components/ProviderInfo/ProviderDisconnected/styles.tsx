import { sm } from 'src/theme/variables'
export const styles = () => ({
  network: {
    fontFamily: 'Inter, sans-serif',
  },
  account: {
    alignItems: 'start',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: 'center',
    paddingRight: sm,
  },
  connect: {
    letterSpacing: '-0.5px',
    whiteSpace: 'nowrap',
  },
})
