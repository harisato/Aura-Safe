import { createStyles } from '@material-ui/core/styles'
import { boldFont, border, lg, sm, colorLinear, borderLinear } from 'src/theme/variables'
import styled from 'styled-components'
import Button from 'src/components/layout/Button'
import { Text } from '@aura/safe-aura-components'

export const styles = createStyles({
  formContainer: {
    padding: `${sm} ${lg}`,
  },
  root: {
    display: 'flex',
    maxWidth: '480px',
    alignItems: 'center',
    gap: '24px'
  },
  saveBtn: {
    fontWeight: boldFont,
    marginRight: sm,
    background: colorLinear,
  },
  controlsRow: {
    borderTop: `1px solid ${border}`,
    padding: lg,
    marginTop: sm,
  },
})

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
export { StyledButtonBorder, StyledBorder, StyledButtonLabel }
