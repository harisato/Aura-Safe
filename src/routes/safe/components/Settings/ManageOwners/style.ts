import { createStyles, makeStyles } from '@material-ui/core'

import { lg, sm, bgBox } from 'src/theme/variables'

export const useStyles = makeStyles(
  createStyles({
    formContainer: {
      // minHeight: '420px',
      minHeight: 'min-content',
      backgroundColor: `${bgBox}`,
      borderRadius: 8,
      padding: `${sm} ${lg}`,
    },
    title: {
      paddingBottom: 0,
    },
    annotation: {
      // paddingLeft: lg,
    },
    hide: {
      // '&:hover': {
      //   backgroundColor: '#f7f5f5',
      // },
      '& $actions': {
        visibility: 'initial',
      },
    },
    actions: {
      justifyContent: 'flex-end',
      visibility: 'hidden',
      minWidth: '100px',
      gap: '16px',
    },
    tr: {
      height: '60px',
    },
    noBorderBottom: {
      '& > td': {
        borderBottom: 'none',
      },
    },
    editOwnerIcon: {
      cursor: 'pointer',
    },
    replaceOwnerIcon: {
      marginLeft: lg,
      cursor: 'pointer',
    },
    controlsRow: {
      backgroundColor: 'white',
      padding: lg,
      borderRadius: sm,
    },
    removeOwnerIcon: {
      marginLeft: lg,
      cursor: 'pointer',
    },
  }),
)
