import { createStyles } from '@material-ui/core/styles'
import { border, fancy, screenSm, warning } from 'src/theme/variables'

export const styles = createStyles({
  root: {
    display: 'none',
    [`@media (min-width: ${screenSm}px)`]: {
      display: 'flex',
    },
  },
  dot: {
    position: 'relative',
    backgroundColor: '#ffffff',
    color: fancy,
  },
  key: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: border,
  },
  warning: {
    position: 'relative',
    top: '-2px',
  },
})

export const buildKeyStyleFrom = (size, center, dotSize) => ({
  width: `${size}px`,
  height: `${size}px`,
  marginLeft: center ? `${dotSize}px` : 'none',
  borderRadius: `${size}px`,
})

export const buildDotStyleFrom = (size, top, right, mode) => ({
  width: `${size}px`,
  height: `${size}px`,
  borderRadius: `${size}px`,
  top: `${top}px`,
  right: `${right}px`,
  color: mode === 'error' ? fancy : warning,
})
