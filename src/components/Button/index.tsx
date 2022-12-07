import { Button } from '@aura/safe-react-components'
import styled from 'styled-components'
import { borderLinear, colorLinear } from 'src/theme/variables'

export const OutlinedButton = styled(Button)`
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

export const OutlinedNeutralButton = styled(Button)`
  border: 1px solid #5c606d;
  border-radius: 50px !important;
  padding: 0 !important;
  min-width: 130px !important;
  background-color: transparent !important;
`
export const TextButton = styled(Button)`
  border: none;
  padding: 0 !important;
  min-width: 130px !important;
  background-color: transparent !important;
  box-shadow: none !important;
`
export const LinkButton = styled.button`
  border: none;
  padding: 0 !important;
  background-color: transparent !important;
  box-shadow: none !important;
  color: #5ee6d0;
  text-decoration: underline;
  cursor: pointer;
`
export const FilledButton = styled(Button)`
  background-image: ${colorLinear};
  border-radius: 50px !important;
  padding: 8px 20px;
  min-width: 130px !important;
  color: #000 !important;
  &:disabled {
    cursor: not-allowed;
    pointer-events: unset;
  }
`
