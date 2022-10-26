import { Button } from '@aura/safe-react-components'
import styled from 'styled-components'
import { borderLinear } from 'src/theme/variables'

const OutlinedButton = styled(Button)`
  border: 2px solid transparent;
  background-image: ${borderLinear};
  background-origin: border-box;
  background-clip: content-box, border-box;
  border-radius: 50px !important;
  padding: 0 !important;
  background-color: transparent !important;
  min-width: 130px !important;
  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
  }
`

const OutlinedNeutralButton = styled(Button)`
  border: 1px solid #5c606d;
  border-radius: 50px !important;
  padding: 0 !important;
  min-width: 130px !important;
  background-color: transparent !important;
`
const TextButton = styled(Button)`
  border: none;
  padding: 0 !important;
  min-width: 130px !important;
  background-color: transparent !important;
  box-shadow: none !important;
`

export { OutlinedButton, OutlinedNeutralButton, TextButton }
