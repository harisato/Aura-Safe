import { lg, md, secondaryText } from 'src/theme/variables'
import { createStyles } from '@material-ui/core'
import styled from 'styled-components'

const styles = createStyles({
  heading: {
    padding: `${md} ${lg}`,
    justifyContent: 'flex-start',
    boxSizing: 'border-box',
    maxHeight: '74px',
  },
  annotation: {
    letterSpacing: '-1px',
    color: secondaryText,
    margin: '0px'
    // marginRight: 'auto',
    // marginLeft: '20px',
  },
  headingText: {
    fontSize: lg,
  },
  closeIcon: {
    height: '28px',
    width: '28px',
    color: '#777E91',
  },
  chainIndicator: {
    padding: `0 ${md}`,
    height: '20px',
    alignItems: 'center',
    color: '#98989B'
  },
  icon: {
    width: '20px',
    marginRight: '10px',
  },
})

const StyledFlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

export { StyledFlexColumn, styles }
