import { createStyles, makeStyles } from '@material-ui/core'

export const useTextFieldLabelStyle = makeStyles(
  createStyles({
    root: {
      overflow: 'hidden',
      borderRadius: 4,
      fontSize: '15px',
      width: '500px',
      color: '#03a9f4 !important',
    },
  }),
)

export const useTextFieldInputStyle = makeStyles(
  createStyles({
    root: {
      color: '#98989B',
      fontSize: '14px',
      width: '100%',
    },
  }),
)
