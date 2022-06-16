import { createStyles } from '@material-ui/core'
import { borderLinear } from 'src/theme/variables'

const styles = createStyles({
  border: {
    border: '2px solid transparent',
    backgroundImage: borderLinear,
    backgroundOrigin: 'border-box',
    backgroundClip: 'content-box, border-box',
    borderRadius: 50,
  },
  ButtonBorder: {
    backgroundColor: 'transparent !important',
  },
})

export { styles }
