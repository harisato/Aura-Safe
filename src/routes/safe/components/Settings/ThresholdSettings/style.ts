import { createStyles } from '@material-ui/core/styles'
import { border, fontColor, lg, secondaryText, smallFontSize, xl, bgBox } from 'src/theme/variables'

export const styles = createStyles({
  ownersText: {
    color: secondaryText,
    '& b': {
      color: fontColor,
    },
  },
  container: {
    padding: lg,
    backgroundColor: bgBox,
    borderRadius: 8,
  },
  buttonRow: {
    padding: lg,
    position: 'absolute',
    left: 0,
    bottom: 0,
    boxSizing: 'border-box',
    width: '100%',
    justifyContent: 'flex-end',
    borderTop: `2px solid ${border}`,
  },
  modifyBtn: {
    height: xl,
    fontSize: smallFontSize,
  },
})
