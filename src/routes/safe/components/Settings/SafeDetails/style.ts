import { createStyles } from '@material-ui/core/styles'
import { boldFont, border, lg, sm, colorLinear } from 'src/theme/variables'

export const styles = createStyles({
  formContainer: {
    padding: lg,
  },
  root: {
    display: 'flex',
    maxWidth: '480px',
  },
  saveBtn: {
    fontWeight: boldFont,
    marginRight: sm,
    background: colorLinear,
  },
  controlsRow: {
    borderTop: `2px solid ${border}`,
    padding: lg,
    marginTop: sm,
  },
})
