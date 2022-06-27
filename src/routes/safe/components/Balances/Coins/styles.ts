import { sm, bgBox } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'
import styled from 'styled-components'
import { Button } from '@gnosis.pm/safe-react-components'
const styles = createStyles({
  iconSmall: {
    fontSize: 16,
  },
  tooltipInfo: {
    position: 'relative',
    top: '3px',
    left: '3px',
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
  },
  leftIcon: {
    marginRight: sm,
  },
  currencyValueRow: {
    textAlign: 'right',
  },
  table: {
    backgroundColor: bgBox,
  },
})

const StyledButton = styled(Button)`
  &&.MuiButton-root {
    margin: 4px 12px 4px 0px;
    padding: 0 12px;
    min-width: auto;
  }
  svg {
    margin: 0 6px 0 0;
  }
`
export { StyledButton, styles }
