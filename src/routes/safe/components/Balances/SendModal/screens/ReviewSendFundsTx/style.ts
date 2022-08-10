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

  gasButton: {
    borderRadius: '50px',
    width: '250px',
    height: '40px',
    border: '2px solid transparent',
    backgroundImage: `${borderLinear}`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    textAlign: 'center',
    display: 'flex',
    fontSize: 14,
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
  },
  gasInput: {
    width: '300px',
    borderRadius: '8px',
    border: '1px solid transparent',
    backgroundImage: `${borderLinear}`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  inputGas: {
    backgroundColor: 'transparent',
    border: 'transparent',
    outline: 'none',
    color: 'white',
    width: '98%',
    marginLeft: 10,
  },
  titleGasInput: {
    fontWeight: 400,
    fontSize: 12,
    color: '#5EE6D0',
    marginLeft: 13,
  },
})
