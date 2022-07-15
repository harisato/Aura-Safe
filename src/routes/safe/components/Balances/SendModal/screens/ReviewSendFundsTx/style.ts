import { lg, md, sm, borderLinear } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'

export const styles = createStyles({
  container: {
    padding: `${md} ${lg}`,
  },
  amount: {
    marginLeft: sm,
    alignSelf: 'center',
  },
  buttonRow: {
    height: '84px',
    justifyContent: 'center',
    gap: '16px',
  },
  gasInput: {
    width: '300px',
    borderRadius: '8px',
    border: '1px solid transparent',
    backgroundImage: `${borderLinear}`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    color: 'white',
    fontSize: 16,
    outline: 'none',
  },
  gasButton: {
    borderRadius: '50px',
    width: '250px',
    height: '40px',
    border: '2px solid transparent',
    backgroundImage: `${borderLinear}`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    fontSize: 16,
    cuisor: 'pointer',
  },
})
