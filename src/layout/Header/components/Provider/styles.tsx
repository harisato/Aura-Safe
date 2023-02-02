import { screenSm, sm } from 'src/theme/variables'
export const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
  },
  provider: {
    alignItems: 'center',
    cursor: 'pointer',
    display: 'flex',
    flex: '1 1 auto',
    padding: '20px 12px',
    [`@media (min-width: ${screenSm}px)`]: {
      paddingLeft: sm,
      paddingRight: sm,
    },
  },
  expand: {
    height: '30px',
    width: '30px',
  },
})
