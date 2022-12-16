import { screenSm, sm } from 'src/theme/variables'
export const styles = () => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    borderLeft: '1px solid #3E3F40',
    borderRight: '1px solid #3E3F40',
    [`@media (min-width: ${screenSm}px)`]: {
      flexBasis: '256pxF',
    },
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
