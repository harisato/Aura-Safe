import { createTheme } from '@material-ui/core/styles'
import { alpha } from '@material-ui/core/styles/colorManipulator'

import {
  boldFont,
  mediumFont,
  border,
  buttonLargeFontSize,
  disabled,
  error,
  extraSmallFontSize,
  fontColor,
  largeFontSize,
  lg,
  mainFontFamily,
  md,
  mediumFontSize,
  primary,
  regularFont,
  secondary,
  secondaryBackground,
  secondaryFontFamily,
  secondaryText,
  sm,
  smallFontSize,
  borderButtonRadius,
  xs,
  bgBox,
  bgInput,
  borderLinear,
  bgDisabledColorStep,
  colorLinear,
  smallsizeFont,
  descriptionAura,
} from './variables'

const palette = {
  primary: {
    main: primary,
  },
  secondary: {
    main: secondary,
  },
  error: {
    main: error,
  },
  success: {
    main: secondary,
  },
  contrastThreshold: 3,
  tonalOffset: 0.2,
}

// see https://material-ui-next.com/customization/themes/
// see https://github.com/mui-org/material-ui/blob/v1-beta/src/styles/createMuiTheme.js
const theme = createTheme({
  typography: {
    fontFamily: mainFontFamily,
    useNextVariants: true,
  },
  overrides: {
    MuiButton: {
      label: {
        lineHeight: '1',
        fontSize: smallsizeFont,
        fontWeight: mediumFont,
      },
      root: {
        fontFamily: secondaryFontFamily,
        letterSpacing: '0.9px',
        '&$disabled': {
          color: `${disabled} !important`,
        },
        color: disabled,
        textTransform: 'none',
        borderRadius: borderButtonRadius,
      },
      contained: {
        boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
      },
      containedPrimary: {
        backgroundColor: 'transparent',
      },
      containedSecondary: {
        backgroundColor: error,
        '&:hover': {
          backgroundColor: '#d4d5d3',
        },
      },
      outlinedPrimary: {
        border: `2px solid ${primary}`,
        '&:hover': {
          border: `2px solid ${primary}`,
        },
      },
      sizeLarge: {
        padding: `${md} ${lg}`,
        minHeight: '52px',
        fontSize: buttonLargeFontSize,
      },
      sizeSmall: {
        minWidth: '130px',
        fontSize: smallFontSize,
      },
      textSecondary: {
        '&:hover': {
          borderRadius: '3px',
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: sm,
      },
      root: {
        color: 'white !important',
        backgroundColor: `${bgBox}`,
      },
    },
    MuiStepper: {
      root: {
        padding: `${lg} 0 0 15px`,
        background: 'transparent',
      },
    },
    MuiIconButton: {
      root: {
        padding: '0',
      },
    },
    MuiChip: {
      root: {
        fontFamily: secondaryFontFamily,
      },
    },
    MuiStepIcon: {
      root: {
        fontSize: '22px',
        color: `${bgDisabledColorStep} !important`,
      },
      completed: {
        color: `${colorLinear} !important`,
        borderRadius: '50%',
      },
      active: {
        color: 'transparent !important',
        borderRadius: '50%',
        background: '#5EE6D0',
        fontWeight: boldFont,
        '& text': {
          fill: '#121212',
        },
      },
    },
    MuiStepContent: {
      root: {
        borderLeft: `1px solid ${secondaryText}`,
      },
    },
    MuiTypography: {
      body1: {
        fontFamily: secondaryFontFamily,
        letterSpacing: '-0.5px',
        fontSize: mediumFontSize,
      },
      body2: {
        fontFamily: secondaryFontFamily,
      },
    },
    MuiFormHelperText: {
      root: {
        color: `${secondary} !important`,
        fontFamily: secondaryFontFamily,
        fontSize: '12px',
        marginTop: '0px',
        order: '0',
        padding: `0 0 0 ${md}`,
        position: 'absolute',
        top: '5px',
        zIndex: 1, // for firefox
      },
    },
    MuiInput: {
      root: {
        backgroundColor: `${bgInput}`,
        borderRadius: '5px',
        color: primary,
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
        lineHeight: '40px',
        order: '1',
        padding: `0 ${md}`,
        '&:$disabled': {
          color: '#0000ff',
        },
        '&:active': {
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
        },
      },
      input: {
        color: descriptionAura,
        display: 'flex',
        height: 'auto',
        letterSpacing: '0.5px',
        padding: '0',
        textOverflow: 'ellipsis',
        '&::-webkit-input-placeholder': {
          color: disabled,
        },
      },
      underline: {
        '&::before': {
          visibility: 'hidden',
          borderBottomColor: secondary,
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        // after pseudo element in the underline is used for the focus border
        '&::after': {
          borderBottomColor: secondary,
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        '&.isValid::before': {
          visibility: 'visible',
          borderBottomColor: `${secondary} !important`,
        },
        '&.isInvalid::after': {
          borderBottomColor: `${error} !important`,
        },
        '&.isValid::after': {
          display: 'none',
        },
        '&:focus': {
          visibility: 'visible',
        },
        '&:hover': {
          visibility: 'visible',
        },
      },
      formControl: {
        marginTop: '0 !important',
      },
    },
    MuiFormLabel: {
      root: {
        color: '#98989B',
        '&.Mui-focused': {
          color: '#98989B',
        },
      },
    },
    MuiFilledInput: {
      root: {
        backgroundColor: '#2E2E33',
        '&:hover': {
          backgroundColor: '#2E2E33',
        },
        '&:focused': {
          backgroundColor: '#2E2E33',
        },
        '&.Mui-focused': {
          backgroundColor: '#2E2E33',
          color: '#98989B',
        },
      },
      underline: {
        // '&::before': {
        //   borderBottomStyle: 'solid',
        //   borderBottomWidth: '2px !important',
        // },
        '&::after': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '2px !important',
        },
        '&.isValid::before': {
          borderBottomColor: `${secondary} !important`,
        },
        '&.isInvalid::after': {
          borderBottomColor: `${error} !important`,
        },
        '&.isValid::after': {
          display: 'none',
        },
      },
    },
    MuiStepLabel: {
      label: {
        textAlign: 'left',
        color: 'white !important',
        fontWeight: '400 !important',
      },
    },
    MuiSvgIcon: {
      root: {
        color: 'white !important',
      },
      colorSecondary: {
        color: secondaryText,
      },
    },
    MuiSnackbar: {
      root: {
        maxWidth: '560px',
        width: '100%',
      },
    },
    MuiSnackbarContent: {
      root: {
        borderRadius: `${sm} !important`,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        padding: '20px',
        width: '100%',
        letterSpacing: '0.1em',
      },
      message: {
        flexGrow: '1',
        fontFamily: 'SFProDisplay !important',
        fontSize: '14px',
        lineHeight: '1.43',
        padding: '0 10px 0 0',
        '& > span': {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: '160px',
          wordBreak: 'break-word',
          '& > img': {
            display: 'block',
            marginRight: '13px',
          },
        },
      },
      action: {
        paddingLeft: '0',
        '& > button': {
          color: secondaryText,
        },
      },
    },
    MuiTab: {
      root: {
        fontFamily: secondaryFontFamily,
        fontWeight: boldFont,
        fontSize: 16,
        color: '#9DA1AC !important',

        '& p': {
          color: 'white !important',
        },
        '&$selected': {
          color: 'white !important',
          '& p': {
            color: '#5ee6d0 !important',
          },
        },
        '@media (min-width: 960px)': {
          fontSize: 16, // override material-ui media query
        },
      },
    },
    MuiTableContainer: {
      root: {},
    },
    MuiTablePagination: {
      toolbar: {
        minHeight: '60px',
        paddingRight: '15px',
        '& > span:nth-child(2)': {
          order: 1,
        },
      },
      selectIcon: {
        height: '100%',
        top: '0px',
      },
      caption: {
        color: disabled,
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
        order: '2',
      },
      input: {
        color: disabled,
        order: '2',
        width: '60px',
      },
      select: {
        minWidth: lg,
        paddingRight: '30',
      },
      actions: {
        color: disabled,
        order: '4',
      },
    },
    MuiTableSortLabel: {
      root: {
        fontSize: extraSmallFontSize,
        color: 'white !important',
      },
      active: {
        fontWeight: boldFont,
      },
    },
    MuiTableRow: {
      head: {
        borderBottom: '1px solid #3E3F40',
      },
    },
    MuiTableCell: {
      root: {
        // borderBottomWidth: '2px',
        borderBottom: '0px',
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
      },
      head: {
        letterSpacing: '1px',
        color: 'white',
        textTransform: 'uppercase',
      },
      body: {
        color: primary,
        fontWeight: 'normal',
        letterSpacing: 'normal',
        overflow: 'hidden',
        paddingBottom: xs,
        paddingTop: xs,
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
    MuiBackdrop: {
      root: {
        backdropFilter: 'blur(1px)',
        backgroundColor: 'rgba(0, 0, 0, 0.9) !important',
        top: '52px',
      },
    },
    MuiMenuItem: {
      root: {
        fontFamily: secondaryFontFamily,
        border: 'none',
      },
    },
    MuiListItemIcon: {
      root: {
        minWidth: 'auto',
      },
    },
    MuiListItemText: {
      primary: {
        color: primary,
        fontFamily: secondaryFontFamily,
        fontSize: mediumFontSize,
        fontWeight: mediumFont,
      },
      secondary: {
        color: disabled,
        fontFamily: secondaryFontFamily,
        fontSize: smallFontSize,
      },
    },
    MuiCheckbox: {
      colorSecondary: {
        '&$disabled': {
          color: alpha(secondary, 0.5),
        },
      },
    },
    MuiFormControlLabel: {
      label: {
        '&$disabled': {
          color: primary,
        },
      },
    },
    MuiDivider: {
      vertical: {
        backgroundColor: 'rgba(62, 63, 64, 1)',
      },
    },
    MuiTouchRipple: {
      root: {
        backgroundColor: 'transparent',
      },
    },
    MuiTabs: {
      root: {},
      indicator: {
        backgroundColor: '#5ee6d0 !important',
      },
      scroller: {
        borderBottom: '1px solid rgba(55, 55, 61, 1) !important',
      },
    },
    MuiPaginationItem: {
      root: {
        color: 'white',
        fontSize: 14,
        fontWeight: 510,
      },
      page: {
        '&$selected': {
          color: '#5EE6D0',
          border: '1px solid #5EE6D0',
        },
      },
    },
  },
  palette,
} as any)

export default theme

export const DropdownListTheme = {
  ...theme,
  overrides: {
    ...theme.overrides,
    MuiPaper: {
      root: {
        marginTop: '10px',
      },
      elevation0: {
        // boxShadow: '1px 2px 10px 0 rgba(212, 212, 211, 0.59)',
      },
      rounded: {
        borderRadius: xs,
      },
    },
    MuiList: {
      padding: {
        paddingBottom: '0',
        paddingTop: '0',
      },
    },
    MuiListItem: {
      root: {
        borderBottom: `2px solid ${border}`,
        '&:last-child': {
          borderBottom: 'none',
        },
        boxSizing: 'border-box',
      },
      button: {
        '&:hover': {
          // backgroundColor: '#f7f5f5',
        },
      },
    },
  },
}
