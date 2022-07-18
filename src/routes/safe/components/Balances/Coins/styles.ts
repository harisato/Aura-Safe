import { sm, bgBox, borderLinear } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'
import styled from 'styled-components'
import { Button, Text } from '@gnosis.pm/safe-react-components'

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

const StyledButton = styled.div`
  svg {
    margin-right: 5px;
  }
  display: flex;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 30px;
  background-color: transparent;
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  cursor: pointer;
  margin-left: 10px;
`

export { StyledButton, styles }
