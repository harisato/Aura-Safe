import { createStyles, makeStyles } from '@material-ui/core/styles'
import { borderLinear, lg, md, sm, xs } from 'src/theme/variables'
import styled from 'styled-components'

import { Button, Text } from '@aura/safe-aura-components'

export const useStyles = makeStyles(
  createStyles({
    heading: {
      padding: `${md} ${lg}`,
      justifyContent: 'space-between',
      boxSizing: 'border-box',
      height: '74px',
    },
    manage: {
      fontSize: lg,
      marginTop: `${xs}`,
    },
    disclaimer: {
      marginBottom: `-${md}`,
      paddingTop: md,
      textAlign: 'center',
    },
    disclaimerText: {
      fontSize: md,
      marginBottom: `${md}`,
    },
    closeIcon: {
      height: '28px',
      width: '28px',
      color: '#777E91',
    },
    buttonColumn: {
      margin: '52px 0 44px 0',
    },
    firstButton: {
      marginBottom: 12,
    },
    iconSmall: {
      fontSize: 16,
    },
    leftIcon: {
      marginRight: sm,
    },
  }),
)

const StyledBorder = styled.div`
  border-radius: 50px !important;
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
`

const StyledButtonBorder = styled(Button)`
  background-color: rgba(18, 18, 18, 1) !important;
  border-radius: 50px !important;
`

const StyledButtonLabel = styled(Text)`
  color: white;
  background-color: transparent !important;
`

export { StyledBorder, StyledButtonBorder, StyledButtonLabel }
